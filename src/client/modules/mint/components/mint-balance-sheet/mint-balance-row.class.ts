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
    keyset_expiration: number|null;
    derivation_path: string;
    first_seen: number;
    reserve_ratio: string;
    assets: number;

    constructor(balance: MintBalance, keyset: MintKeyset) {
        this.unit = keyset.unit;
        this.liabilities = balance.balance;
        this.fee = keyset.input_fee_ppk;
        this.active = keyset.active;
        this.assets = this.tempSetAssets();
        this.derivation_path = keyset.derivation_path;
        this.first_seen = keyset.first_seen;
        this.keyset_expiration = this.setKeysetExpiration(keyset);
        this.reserve_ratio = this.setReserveRatio(this.assets); // @todo need ln data here
    }

    private tempSetAssets(): number {
        if(this.unit === 'sat') return 2100000;
        if(this.unit === 'usd') return 2500;
        if(this.unit === 'eur') return 1925;
        return 550000;
    }

    private setKeysetExpiration(keyset: MintKeyset): number|null {
        if( keyset.valid_from === keyset.valid_to ) return null;
        return keyset.valid_to;
    }

    private setReserveRatio(assets: number = 1000): string {
        const ratio = assets / AmountPipe.getConvertedAmount(this.unit, this.liabilities);
        const formatted_ratio = Number.isInteger(ratio) ? ratio.toString() : (ratio.toFixed(1).endsWith('.0') ? Math.floor(ratio).toString() : ratio.toFixed(1));
        return `${formatted_ratio} : 1`;
    }
}