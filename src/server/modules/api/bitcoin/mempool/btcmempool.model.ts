/* Core Dependencies */
import { Field, ID, Int, Float, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { BitcoinTransaction } from '@server/modules/bitcoin/rpc/btcrpc.types';

@ObjectType()
export class OrchardBitcoinMempoolFees {

	@Field(type => Float)
	base: number;

	@Field(type => Float)
	modified: number;

	@Field(type => Float)
	ancestor: number;

	@Field(type => Float)
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

	@Field(type => ID)
	txid: string;

	@Field(type => Int)
	vsize: number;

	@Field(type => Int)
	weight: number;

	@Field(type => UnixTimestamp)
	time: number;

	@Field(type => Int)
	height: number;

	@Field(type => Int)
	descendantcount: number;

	@Field(type => Int)
	descendantsize: number;

	@Field(type => Int)
	ancestorcount: number;

	@Field(type => Int)
	ancestorsize: number;

	@Field(type => String)
	wtxid: string;

	@Field(type => OrchardBitcoinMempoolFees)
	fees: OrchardBitcoinMempoolFees;

	@Field(type => [String])
	depends: string[];

	@Field(type => [String])
	spentby: string[];

	@Field(type => Boolean)
	bip125_replaceable: boolean;

	@Field(type => Boolean)
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