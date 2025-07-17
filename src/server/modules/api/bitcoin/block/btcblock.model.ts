/* Core Dependencies */
import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { BitcoinBlock, BitcoinBlockTemplate } from '@server/modules/bitcoin/rpc/btcrpc.types';

@ObjectType()
export class OrchardBitcoinRawTransaction {

    @Field(type => String)
    txid: string;

    @Field(type => Float, { nullable: true })
    fee: number;

    @Field(type => Int, { nullable: true })
    vsize: number;

    constructor(obrt: BitcoinBlock['tx'][number]) {
        this.txid = obrt.txid;
        this.fee = obrt.fee;
        this.vsize = obrt.vsize;
    }
}

@ObjectType()
export class OrchardBitcoinBlock {

	@Field(type => String)
	hash: string;

	@Field(type => Int)
	confirmations: number;

	@Field(type => Int)
	height: number;

	@Field(type => Float)
	version: number;

	@Field(type => String)
	versionHex: string;

	@Field(type => String)
	merkleroot: string;

	@Field(type => UnixTimestamp)
	time: number;

	@Field(type => UnixTimestamp)
	mediantime: number;

	@Field(type => Float)
	nonce: number;

	@Field(type => String)
	bits: string;

	@Field(type => Float)
	difficulty: number;

	@Field(type => String)
	chainwork: string;

	@Field(type => Int)
	nTx: number;

	@Field(type => String)
	previousblockhash: string;

	@Field(type => String, { nullable: true })
	nextblockhash: string;

	@Field(type => Int)
	strippedsize: number;

	@Field(type => Int)
	size: number;

	@Field(type => Float)
	weight: number;

	@Field(type => [OrchardBitcoinRawTransaction])
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
		this.tx = obb.tx.map(tx => new OrchardBitcoinRawTransaction(tx));
	}
}

@ObjectType()
export class OrchardBitcoinBlockTemplateTransaction {

    @Field(type => String)
    data: string;

    @Field(type => String)
    txid: string;

    @Field(type => String)
    hash: string;

    @Field(type => [Int])
    depends: number[];

    @Field(type => Int)
    fee: number;

    @Field(type => Int)
    sigops: number;

    @Field(type => Int)
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

    @Field(type => Int)
    version: number;

    @Field(type => [String])
    rules: string[];

    @Field(type => Int)
    vbrequired: number;

    @Field(type => String)
    previousblockhash: string;

    @Field(type => [OrchardBitcoinBlockTemplateTransaction])
    transactions: OrchardBitcoinBlockTemplateTransaction[];

    @Field(type => Int)
    coinbasevalue: number;

    @Field(type => String)
    longpollid: string;

    @Field(type => String)
    target: string;

    @Field(type => Int)
    mintime: number;

    @Field(type => [String])
    mutable: string[];

    @Field(type => String)
    noncerange: string;

    @Field(type => Int)
    sigoplimit: number;

    @Field(type => Int)
    sizelimit: number;

    @Field(type => Int)
    weightlimit: number;

    @Field(type => Int)
    curtime: number;

    @Field(type => Int)
    height: number;

    @Field(type => String, { nullable: true })
    default_witness_commitment: string;

    @Field(type => String)
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