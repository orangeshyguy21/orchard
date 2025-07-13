import { OrchardBitcoinTxFeeEstimate } from "@shared/generated.types";

export class BitcoinTransactionFeeEstimate implements OrchardBitcoinTxFeeEstimate {

    public blocks: number;
    public errors: string[] | null;
    public feerate: number | null;
    public target: number;

    constructor(fee_estimate: OrchardBitcoinTxFeeEstimate) {
        this.blocks = fee_estimate.blocks;
        this.errors = fee_estimate.errors ?? null;
        this.feerate = fee_estimate.feerate ?? null;
        this.target = fee_estimate.target;
    }
}