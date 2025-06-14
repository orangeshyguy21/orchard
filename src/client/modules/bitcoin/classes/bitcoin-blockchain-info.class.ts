import { OrchardBitcoinBlockchainInfo } from "@shared/generated.types";

export class BitcoinBlockchainInfo implements OrchardBitcoinBlockchainInfo {

	public chain: string;
	public blocks: number;
	public headers: number;
	public bestblockhash: string;
	public difficulty: number;
	public verificationprogress: number;
	public initialblockdownload: boolean;
	public chainwork: string;
	public size_on_disk: number;
	public pruned: boolean;
	public pruneheight: number | null;
	public automatic_pruning: boolean | null;
	public prune_target_size: number | null;
	public warnings: string[];

	constructor(obc: OrchardBitcoinBlockchainInfo) {
		this.chain = obc.chain;
		this.blocks = obc.blocks;
		this.headers = obc.headers;
		this.bestblockhash = obc.bestblockhash;
		this.difficulty = obc.difficulty;
		this.verificationprogress = obc.verificationprogress;
		this.initialblockdownload = obc.initialblockdownload;
        this.chainwork = obc.chainwork;
        this.size_on_disk = obc.size_on_disk;
        this.pruned = obc.pruned;
        this.pruneheight = obc.pruneheight ?? null;
        this.automatic_pruning = obc.automatic_pruning ?? null;
        this.prune_target_size = obc.prune_target_size ?? null;
        this.warnings = obc.warnings;
	}
}