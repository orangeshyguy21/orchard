/* Application Dependencies */
import { AmountPipe } from "@client/modules/local/pipes/amount/amount.pipe";

/* Native Dependencies */
import { MintBalance } from "@client/modules/mint/classes/mint-balance.class";
import { MintKeyset } from "@client/modules/mint/classes/mint-keyset.class";

export class MintBalanceRow {

    unit: string;
    liabilities: number;
    fee: number;
    active: boolean;
    derivation_path: string;
    first_seen: number;
    assets: number;

    public get reserve_ratio(): string {
        const ratio = this.assets / AmountPipe.getConvertedAmount(this.unit, this.liabilities);
        const formatted_ratio = Number.isInteger(ratio) ? ratio.toString() : (ratio.toFixed(1).endsWith('.0') ? Math.floor(ratio).toString() : ratio.toFixed(1));
        if (ratio === Infinity) return '∞ : 1';
        return `${formatted_ratio} : 1`;
    }

    constructor(balance: MintBalance | undefined, keyset: MintKeyset) {
        this.unit = keyset.unit;
        this.liabilities = balance?.balance ?? 0;
        this.fee = keyset.input_fee_ppk;
        this.active = keyset.active;
        this.assets = this.tempSetAssets();
        this.derivation_path = keyset.derivation_path;
        this.first_seen = keyset.first_seen;
    }

    private tempSetAssets(): number {
        if(this.unit === 'sat') return 2100000;
        if(this.unit === 'usd') return 2500;
        if(this.unit === 'eur') return 1925;
        return 550000;
    }
}