import { OrchardBitcoinBlockTemplate, OrchardBitcoinBlockTemplateTransaction } from "@shared/generated.types";

export class BitcoinBlockTemplate implements OrchardBitcoinBlockTemplate {

    public bits: string;
    public coinbasevalue: number;
    public curtime: number;
    public default_witness_commitment: string | null;
    public height: number;
    public longpollid: string;
    public mintime: number;
    public mutable: string[];
    public noncerange: string;
    public previousblockhash: string;
    public rules: string[];
    public sigoplimit: number;
    public sizelimit: number;
    public target: string;
    public transactions: OrchardBitcoinBlockTemplateTransaction[];
    public vbrequired: number;
    public version: number;
    public weightlimit: number;

    constructor(block_template: OrchardBitcoinBlockTemplate) {
        this.bits = block_template.bits;
        this.coinbasevalue = block_template.coinbasevalue;
        this.curtime = block_template.curtime;
        this.default_witness_commitment = block_template.default_witness_commitment ?? null;
        this.height = block_template.height;
        this.longpollid = block_template.longpollid;
        this.mintime = block_template.mintime;
        this.mutable = block_template.mutable;
        this.noncerange = block_template.noncerange;
        this.previousblockhash = block_template.previousblockhash;
        this.rules = block_template.rules;
        this.sigoplimit = block_template.sigoplimit;
        this.sizelimit = block_template.sizelimit;
        this.target = block_template.target;
        this.transactions = block_template.transactions;
        this.vbrequired = block_template.vbrequired;
        this.version = block_template.version;
        this.weightlimit = block_template.weightlimit;
    }
}
