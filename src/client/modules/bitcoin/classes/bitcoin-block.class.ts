import { OrchardBitcoinBlock, OrchardBitcoinRawTransaction } from "@shared/generated.types";

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
    public tx: OrchardBitcoinRawTransaction[];

    public feerate_lowest: number;
    public feerate_highest: number;
    public fullness: number;

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
        
        const { fee_lowest, fee_highest } = this.calculateFeeRange();
        this.feerate_lowest = fee_lowest;
        this.feerate_highest = fee_highest;
        this.fullness = this.calculateFullness();
	}

    private calculateFeeRange(): { fee_lowest: number; fee_highest: number } {
        let fee_lowest = Infinity;
        let fee_highest = -Infinity;

        for (const tx of this.tx) {
            const feerate = this.calculateFeerate(tx);
            if( feerate === null ) continue;
            if( feerate < fee_lowest ) fee_lowest = feerate;
            if( feerate > fee_highest ) fee_highest = feerate;
        }

        return {
            fee_lowest: isFinite(fee_lowest) ? fee_lowest : 0,
            fee_highest: isFinite(fee_highest) ? fee_highest : 0,
        };
    }

    private calculateFeerate(tx: OrchardBitcoinRawTransaction): number | null {
        if( !tx.fee || !tx.vsize ) return null;
        return (tx.fee * 1000) / tx.vsize;
    }

    private calculateFullness(): number {
        return this.weight / 4000000;
    }
}