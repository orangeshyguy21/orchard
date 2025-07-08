import { OrchardBitcoinBlock } from "@shared/generated.types";

export class BitcoinBlock implements OrchardBitcoinBlock {

    public bits: string;
    public chainwork: string;
    public confirmations: number;
    public difficulty: number;
    public hash: string;
    public height: number;
    public mediantime: number;
    public merkleroot: string;
    public nTx: number;
    public nextblockhash: string | null;
    public nonce: number;
    public previousblockhash: string;
    public size: number;
    public strippedsize: number;
    public time: number;
    public version: number;
    public versionHex: string;
    public weight: number;
    public tx: string[];

	constructor(obn: OrchardBitcoinBlock) {
        this.bits = obn.bits;
        this.chainwork = obn.chainwork;
        this.confirmations = obn.confirmations;
        this.difficulty = obn.difficulty;
        this.hash = obn.hash;
        this.height = obn.height;
        this.mediantime = obn.mediantime;
        this.merkleroot = obn.merkleroot;
        this.nTx = obn.nTx;
        this.nextblockhash = obn.nextblockhash ?? null;
        this.nonce = obn.nonce;
        this.previousblockhash = obn.previousblockhash;
        this.size = obn.size;
        this.strippedsize = obn.strippedsize;
        this.time = obn.time;
        this.version = obn.version;
        this.versionHex = obn.versionHex;
        this.weight = obn.weight;
        this.tx = obn.tx;
	}
}