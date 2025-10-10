/* Core Dependencies */
import {Field, Int, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {BitcoinBlockchainInfo} from '@server/modules/bitcoin/rpc/btcrpc.types';

@ObjectType()
export class OrchardBitcoinBlockCount {
	@Field(() => Int)
	height: number;

	constructor(height: number) {
		this.height = height;
	}
}
@ObjectType()
export class OrchardBitcoinBlockchainInfo {
	@Field(() => String)
	chain: string;

	@Field(() => Int)
	blocks: number;

	@Field(() => Int)
	headers: number;

	@Field(() => String)
	bestblockhash: string;

	@Field(() => Float)
	difficulty: number;

	@Field(() => Float)
	verificationprogress: number;

	@Field(() => Boolean)
	initialblockdownload: boolean;

	@Field(() => String)
	chainwork: string;

	@Field(() => Float)
	size_on_disk: number;

	@Field(() => Boolean)
	pruned: boolean;

	@Field(() => Int, {nullable: true})
	pruneheight: number;

	@Field(() => Boolean, {nullable: true})
	automatic_pruning: boolean;

	@Field(() => Int, {nullable: true})
	prune_target_size: number;

	@Field(() => [String])
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
		this.warnings = Array.isArray(obi.warnings) ? obi.warnings : [obi.warnings];
	}
}
