/* Native Module Dependencies */
import { MintBalance } from "@client/modules/mint/classes/mint-balance.class";
import { MintKeyset } from "@client/modules/mint/classes/mint-keyset.class";

export class MintBalanceTableRow {

    unit: string;
    liabilities: number;
    fee: number;
    active: boolean;
    keyset_expiration: number|null;
    reserve_ratio: string;
    assets: number;
    constructor(balance: MintBalance, keyset: MintKeyset) {
        this.unit = keyset.unit;
        this.liabilities = balance.balance;
        this.fee = keyset.input_fee_ppk;
        this.active = keyset.active;
        this.assets = 1000;
        this.keyset_expiration = this.setKeysetExpiration(keyset);
        this.reserve_ratio = this.setReserveRatio(); // @todo need ln data here
    }

    private setKeysetExpiration(keyset: MintKeyset): number|null {
        if( keyset.valid_from === keyset.valid_to ) return null;
        return keyset.valid_to;
    }

    private setReserveRatio(assets: number = 1000): string {
        const ratio = assets / this.liabilities;
        const formatted_ratio = Number.isInteger(ratio) ? ratio.toString() : ratio.toFixed(1);
        return `${formatted_ratio} : 1`;
    }
}