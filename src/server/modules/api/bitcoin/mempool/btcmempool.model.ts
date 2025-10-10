/* Core Dependencies */
import {Field, ID, Int, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {BitcoinTransaction} from '@server/modules/bitcoin/rpc/btcrpc.types';

@ObjectType()
export class OrchardBitcoinMempoolFees {
	@Field(() => Float)
	base: number;

	@Field(() => Float)
	modified: number;

	@Field(() => Float)
	ancestor: number;

	@Field(() => Float)
	descendant: number;

	constructor(fees: BitcoinTransaction['fees']) {
		this.base = fees.base;
		this.modified = fees.modified;
		this.ancestor = fees.ancestor;
		this.descendant = fees.descendant;
	}
}

@ObjectType()
export class OrchardBitcoinMempoolTransaction {
	@Field(() => ID)
	txid: string;

	@Field(() => Int)
	vsize: number;

	@Field(() => Int)
	weight: number;

	@Field(() => UnixTimestamp)
	time: number;

	@Field(() => Int)
	height: number;

	@Field(() => Int)
	descendantcount: number;

	@Field(() => Int)
	descendantsize: number;

	@Field(() => Int)
	ancestorcount: number;

	@Field(() => Int)
	ancestorsize: number;

	@Field(() => String)
	wtxid: string;

	@Field(() => OrchardBitcoinMempoolFees)
	fees: OrchardBitcoinMempoolFees;

	@Field(() => [String])
	depends: string[];

	@Field(() => [String])
	spentby: string[];

	@Field(() => Boolean)
	bip125_replaceable: boolean;

	@Field(() => Boolean)
	unbroadcast: boolean;

	constructor(tx: BitcoinTransaction, txid: string) {
		this.txid = txid;
		this.vsize = tx.vsize;
		this.weight = tx.weight;
		this.time = tx.time;
		this.height = tx.height;
		this.descendantcount = tx.descendantcount;
		this.descendantsize = tx.descendantsize;
		this.ancestorcount = tx.ancestorcount;
		this.ancestorsize = tx.ancestorsize;
		this.wtxid = tx.wtxid;
		this.fees = tx.fees;
		this.depends = tx.depends;
		this.spentby = tx.spentby;
		this.bip125_replaceable = tx['bip125-replaceable'];
		this.unbroadcast = tx.unbroadcast;
	}
}
