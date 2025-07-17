import { OrchardBitcoinMempoolFees, OrchardBitcoinMempoolTransaction } from "@shared/generated.types";

export class BitcoinTransaction {

    public txid: string;
    public vsize: number;
    public weight: number;
    public time: number;
    public height: number;
    public descendantcount: number;
    public descendantsize: number;
    public ancestorcount: number;
    public ancestorsize: number;
    public wtxid: string;
    public fees: OrchardBitcoinMempoolFees;
    public depends: string[];
    public spentby: string[];
    public bip125_replaceable: boolean;
    public unbroadcast: boolean;

    constructor(tx: OrchardBitcoinMempoolTransaction) {
        this.txid = tx.txid;
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
        this.bip125_replaceable = tx.bip125_replaceable;
        this.unbroadcast = tx.unbroadcast;
    }
}