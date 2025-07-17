import {OrchardBitcoinBlockTemplate, OrchardBitcoinBlockTemplateTransaction} from '@shared/generated.types';

export class BitcoinBlockTemplate implements OrchardBitcoinBlockTemplate {
	public bits: string;
	public coinbasevalue: number;
	public curtime: number;
	public default_witness_commitment: string | null;
	public height: number;
	public longpollid: string;
	public mintime: number;
	public mutable: string[];
	public noncerange: string;
	public previousblockhash: string;
	public rules: string[];
	public sigoplimit: number;
	public sizelimit: number;
	public target: string;
	public transactions: OrchardBitcoinBlockTemplateTransaction[];
	public tx: OrchardBitcoinBlockTemplateTransaction[];
	public vbrequired: number;
	public version: number;
	public weightlimit: number;
	// derived
	public feerate_lowest: number;
	public feerate_highest: number;
	public weight: number;
	public fullness: number;

	constructor(block_template: OrchardBitcoinBlockTemplate) {
		this.bits = block_template.bits;
		this.coinbasevalue = block_template.coinbasevalue;
		this.curtime = block_template.curtime;
		this.default_witness_commitment = block_template.default_witness_commitment ?? null;
		this.height = block_template.height;
		this.longpollid = block_template.longpollid;
		this.mintime = block_template.mintime;
		this.mutable = block_template.mutable;
		this.noncerange = block_template.noncerange;
		this.previousblockhash = block_template.previousblockhash;
		this.rules = block_template.rules;
		this.sigoplimit = block_template.sigoplimit;
		this.sizelimit = block_template.sizelimit;
		this.target = block_template.target;
		this.transactions = block_template.transactions;
		this.vbrequired = block_template.vbrequired;
		this.version = block_template.version;
		this.weightlimit = block_template.weightlimit;
		// derived
		this.tx = block_template.transactions;
		const {fee_lowest, fee_highest} = this.calculateFeeRange();
		this.feerate_lowest = fee_lowest;
		this.feerate_highest = fee_highest;
		this.weight = this.calculateWeight();
		this.fullness = this.calculateFullness();
	}

	private calculateFeeRange(): {fee_lowest: number; fee_highest: number} {
		let fee_lowest = Infinity;
		let fee_highest = -Infinity;

		for (const tx of this.transactions) {
			const feerate = this.calculateFeerate(tx);
			if (feerate === null) continue;
			if (feerate < fee_lowest) fee_lowest = feerate;
			if (feerate > fee_highest) fee_highest = feerate;
		}

		return {
			fee_lowest: isFinite(fee_lowest) ? fee_lowest : 0,
			fee_highest: isFinite(fee_highest) ? fee_highest : 0,
		};
	}

	private calculateFeerate(tx: OrchardBitcoinBlockTemplateTransaction): number | null {
		if (!tx.fee || !tx.weight) return null;
		const vsize = tx.weight / 4;
		return tx.fee / 100000 / vsize;
	}

	private calculateWeight(): number {
		return this.transactions.reduce((sum, tx) => sum + tx.weight, 0);
	}

	private calculateFullness(): number {
		return this.weight / 4000000;
	}
}
