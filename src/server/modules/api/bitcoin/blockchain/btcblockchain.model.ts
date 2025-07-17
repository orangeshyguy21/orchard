/* Core Dependencies */
import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { BitcoinBlockchainInfo } from '@server/modules/bitcoin/rpc/btcrpc.types';

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