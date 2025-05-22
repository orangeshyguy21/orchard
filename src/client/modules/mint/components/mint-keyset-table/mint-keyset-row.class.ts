/* Native Dependencies */
import { MintKeyset } from "@client/modules/mint/classes/mint-keyset.class";
import { MintAnalyticKeyset } from "@client/modules/mint/classes/mint-analytic.class";

export class MintKeysetRow {

    active: boolean;
    derivation_path_index: number;
    id: string;
    input_fee_ppk: number;
    unit: string;
    valid_from: number;
    valid_to: number;
    balance: number;

    constructor(keyset: MintKeyset, keyset_analytics: MintAnalyticKeyset[], keyset_analytics_pre: MintAnalyticKeyset[]) {
        this.active = keyset.active;
        this.derivation_path_index = keyset.derivation_path_index;
        this.id = keyset.id;
        this.input_fee_ppk = keyset.input_fee_ppk;
        this.unit = keyset.unit;
        this.valid_from = keyset.valid_from;
        this.valid_to = keyset.valid_to;
        this.balance = this.getBalance(keyset_analytics, keyset_analytics_pre);
    }

    private getBalance(keyset_analytics: MintAnalyticKeyset[], keyset_analytics_pre: MintAnalyticKeyset[]): number {
        const balance = keyset_analytics.reduce((acc, curr) => acc + curr.amount, 0);
        const balance_pre = keyset_analytics_pre.reduce((acc, curr) => acc + curr.amount, 0);
        return balance_pre + balance;
    }
}