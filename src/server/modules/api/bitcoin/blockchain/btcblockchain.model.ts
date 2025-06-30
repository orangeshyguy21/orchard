/* Core Dependencies */
import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { BitcoinBlockchainInfo, BitcoinBlock } from '@server/modules/bitcoin/rpc/btcrpc.types';

@ObjectType()
export class OrchardBitcoinBlockCount {

	@Field(type => Int)
	height: number;

	constructor(height: number) {
		this.height = height;
	}
}
@ObjectType()
export class OrchardBitcoinBlockchainInfo {

    @Field(type => String)
    chain: string;

	@Field(type => Int)
	blocks: number;

    @Field(type => Int)
    headers: number;

    @Field(type => String)
    bestblockhash: string;

    @Field(type => Float)
    difficulty: number;

    @Field(type => Float)
    verificationprogress: number;

    @Field(type => Boolean)
    initialblockdownload: boolean;

    @Field(type => String)
    chainwork: string;
    
    @Field(type => Float)
    size_on_disk: number;
    
    @Field(type => Boolean)
    pruned: boolean;
    
    @Field(type => Int, { nullable: true })
    pruneheight: number;
    
    @Field(type => Boolean, { nullable: true })
    automatic_pruning: boolean;
    
    @Field(type => Int, { nullable: true })
    prune_target_size: number;
    
    @Field(type => [String])
    warnings: string[];

	constructor(obi: BitcoinBlockchainInfo) {
        this.chain = obi.chain;
		this.blocks = obi.blocks;
        this.headers = obi.headers;
        this.bestblockhash = obi.bestblockhash;
        this.difficulty = obi.difficulty;
        this.verificationprogress = obi.verificationprogress;
        this.initialblockdownload = obi.initialblockdownload;
        this.chainwork = obi.chainwork;
        this.size_on_disk = obi.size_on_disk;
        this.pruned = obi.pruned;
        this.pruneheight = obi.pruneheight;
        this.automatic_pruning = obi.automatic_pruning;
        this.prune_target_size = obi.prune_target_size;
        this.warnings = obi.warnings;
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

	@Field(type => String)
	nextblockhash: string;

	@Field(type => Int)
	strippedsize: number;

	@Field(type => Int)
	size: number;

	@Field(type => Float)
	weight: number;

	@Field(type => [String])
	tx: string[];

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
		this.tx = obb.tx;
	}
}