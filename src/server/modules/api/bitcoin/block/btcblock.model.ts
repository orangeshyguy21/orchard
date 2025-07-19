/* Core Dependencies */
import {Field, Int, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {BitcoinBlock, BitcoinBlockTemplate} from '@server/modules/bitcoin/rpc/btcrpc.types';

@ObjectType()
export class OrchardBitcoinRawTransaction {
	@Field((type) => String)
	txid: string;

	@Field((type) => Float, {nullable: true})
	fee: number;

	@Field((type) => Int, {nullable: true})
	vsize: number;

	constructor(obrt: BitcoinBlock['tx'][number]) {
		this.txid = obrt.txid;
		this.fee = obrt.fee;
		this.vsize = obrt.vsize;
	}
}

@ObjectType()
export class OrchardBitcoinBlock {
	@Field((type) => String)
	hash: string;

	@Field((type) => Int)
	confirmations: number;

	@Field((type) => Int)
	height: number;

	@Field((type) => Float)
	version: number;

	@Field((type) => String)
	versionHex: string;

	@Field((type) => String)
	merkleroot: string;

	@Field((type) => UnixTimestamp)
	time: number;

	@Field((type) => UnixTimestamp)
	mediantime: number;

	@Field((type) => Float)
	nonce: number;

	@Field((type) => String)
	bits: string;

	@Field((type) => Float)
	difficulty: number;

	@Field((type) => String)
	chainwork: string;

	@Field((type) => Int)
	nTx: number;

	@Field((type) => String)
	previousblockhash: string;

	@Field((type) => String, {nullable: true})
	nextblockhash: string;

	@Field((type) => Int)
	strippedsize: number;

	@Field((type) => Int)
	size: number;

	@Field((type) => Float)
	weight: number;

	@Field((type) => [OrchardBitcoinRawTransaction])
	tx: OrchardBitcoinRawTransaction[];

	constructor(obb: BitcoinBlock) {
		this.hash = obb.hash;
		this.confirmations = obb.confirmations;
		this.height = obb.height;
		this.version = obb.version;
		this.versionHex = obb.versionHex;
		this.merkleroot = obb.merkleroot;
		this.time = obb.time;
		this.mediantime = obb.mediantime;
		this.nonce = obb.nonce;
		this.bits = obb.bits;
		this.difficulty = obb.difficulty;
		this.chainwork = obb.chainwork;
		this.nTx = obb.nTx;
		this.previousblockhash = obb.previousblockhash;
		this.nextblockhash = obb.nextblockhash;
		this.strippedsize = obb.strippedsize;
		this.size = obb.size;
		this.weight = obb.weight;
		this.tx = obb.tx.map((tx) => new OrchardBitcoinRawTransaction(tx));

		let start = performance.now();
		const {fee_lowest, fee_highest} = this.calculateFeeRange(obb.tx);
		let end = performance.now();
		console.log('time', end - start);
		console.log('height', this.height);
		console.log('fee_lowest', fee_lowest * 100000);
		console.log('fee_highest', fee_highest * 100000);
	}

	private calculateFeeRange(txs: BitcoinBlock['tx']): {fee_lowest: number; fee_highest: number} {
		let fee_lowest = Infinity;
		let fee_highest = -Infinity;
		let lowest_txid = '';

		// Build lookup maps once for the entire block
		const tx_by_txid = new Map<string, BitcoinBlock['tx'][number]>();
		const children_by_parent = new Map<string, BitcoinBlock['tx'][number][]>();
		const all_txids = new Set<string>();

		// O(n) preprocessing
		for (const tx of txs) {
			tx_by_txid.set(tx.txid, tx);
			children_by_parent.set(tx.txid, []);
			all_txids.add(tx.txid);
		}

		// Build parent-child relationships
		for (const tx of txs) {
			for (const input of tx.vin) {
				if (children_by_parent.has(input.txid)) {
					children_by_parent.get(input.txid)!.push(tx);
				}
			}
		}

		// Find root transactions
		const root_txs = this.findRootTransactionsOptimized(txs, all_txids);

		// Calculate effective feerates using pre-built maps
		for (const tx of root_txs) {
			const effective_feerate = this.calculateEffectiveFeerateOptimized(tx, children_by_parent);
			if (effective_feerate === null) continue;
			// if (effective_feerate < fee_lowest) fee_lowest = effective_feerate;
			if (effective_feerate < fee_lowest) {
				fee_lowest = effective_feerate;
				lowest_txid = tx.txid;
			}
			if (effective_feerate > fee_highest) fee_highest = effective_feerate;
		}

		console.log('lowest_txid', lowest_txid);

		return {
			fee_lowest: isFinite(fee_lowest) ? fee_lowest : 0,
			fee_highest: isFinite(fee_highest) ? fee_highest : 0,
		};
	}

	private findRootTransactionsOptimized(all_txs: BitcoinBlock['tx'], all_txids: Set<string>): BitcoinBlock['tx'] {
		const root_txs: BitcoinBlock['tx'] = [];

		for (const tx of all_txs) {
			let is_root = true;
			for (const input of tx.vin) {
				if (all_txids.has(input.txid)) {
					is_root = false;
					break;
				}
			}
			if (is_root) {
				root_txs.push(tx);
			}
		}

		return root_txs;
	}

	private calculateEffectiveFeerateOptimized(
		tx: BitcoinBlock['tx'][number],
		children_by_parent: Map<string, BitcoinBlock['tx'][number][]>,
	): number | null {
		if (!tx.fee || !tx.vsize) return null;

		const descendant_txs = this.findAllDescendantsOptimized(tx.txid, children_by_parent);

		if (descendant_txs.length === 0) {
			return (tx.fee * 1000) / tx.vsize;
		}

		const total_effective_fee = tx.fee + descendant_txs.reduce((sum, descendant) => sum + descendant.fee, 0);
		const total_effective_vsize = tx.vsize + descendant_txs.reduce((sum, descendant) => sum + descendant.vsize, 0);

		return (total_effective_fee * 1000) / total_effective_vsize;
	}

	private findAllDescendantsOptimized(
		parent_txid: string,
		children_by_parent: Map<string, BitcoinBlock['tx'][number][]>,
	): BitcoinBlock['tx'][number][] {
		const descendants: BitcoinBlock['tx'][number][] = [];
		const visited = new Set<string>();
		const to_process = [parent_txid];

		while (to_process.length > 0) {
			const current_txid = to_process.shift()!;

			if (visited.has(current_txid)) continue;
			visited.add(current_txid);

			const children = children_by_parent.get(current_txid) || [];
			for (const child of children) {
				if (!visited.has(child.txid)) {
					descendants.push(child);
					to_process.push(child.txid);
				}
			}
		}

		return descendants;
	}
}

@ObjectType()
export class OrchardBitcoinBlockTemplateTransaction {
	@Field((type) => String)
	data: string;

	@Field((type) => String)
	txid: string;

	@Field((type) => String)
	hash: string;

	@Field((type) => [Int])
	depends: number[];

	@Field((type) => Int)
	fee: number;

	@Field((type) => Int)
	sigops: number;

	@Field((type) => Int)
	weight: number;

	constructor(obbt: BitcoinBlockTemplate['transactions'][number]) {
		this.data = obbt.data;
		this.txid = obbt.txid;
		this.hash = obbt.hash;
		this.depends = obbt.depends;
		this.fee = obbt.fee;
		this.sigops = obbt.sigops;
		this.weight = obbt.weight;
	}
}

@ObjectType()
export class OrchardBitcoinBlockTemplate {
	@Field((type) => Int)
	version: number;

	@Field((type) => [String])
	rules: string[];

	@Field((type) => Int)
	vbrequired: number;

	@Field((type) => String)
	previousblockhash: string;

	@Field((type) => [OrchardBitcoinBlockTemplateTransaction])
	transactions: OrchardBitcoinBlockTemplateTransaction[];

	@Field((type) => Int)
	coinbasevalue: number;

	@Field((type) => String)
	longpollid: string;

	@Field((type) => String)
	target: string;

	@Field((type) => Int)
	mintime: number;

	@Field((type) => [String])
	mutable: string[];

	@Field((type) => String)
	noncerange: string;

	@Field((type) => Int)
	sigoplimit: number;

	@Field((type) => Int)
	sizelimit: number;

	@Field((type) => Int)
	weightlimit: number;

	@Field((type) => Int)
	curtime: number;

	@Field((type) => Int)
	height: number;

	@Field((type) => String, {nullable: true})
	default_witness_commitment: string;

	@Field((type) => String)
	bits: string;

	constructor(obbt: BitcoinBlockTemplate) {
		this.version = obbt.version;
		this.rules = obbt.rules;
		// this.vbavailable = obbt.vbavailable; // omit
		this.vbrequired = obbt.vbrequired;
		this.previousblockhash = obbt.previousblockhash;
		this.transactions = obbt.transactions;
		// this.coinbaseaux = obbt.coinbaseaux; // omit
		this.coinbasevalue = obbt.coinbasevalue;
		this.longpollid = obbt.longpollid;
		this.target = obbt.target;
		this.mintime = obbt.mintime;
		this.mutable = obbt.mutable;
		this.noncerange = obbt.noncerange;
		this.sigoplimit = obbt.sigoplimit;
		this.sizelimit = obbt.sizelimit;
		this.weightlimit = obbt.weightlimit;
		this.curtime = obbt.curtime;
		this.height = obbt.height;
		this.default_witness_commitment = obbt.default_witness_commitment;
		this.bits = obbt.bits;
	}
}
