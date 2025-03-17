/* Native Module Dependencies */
import { MintBalance } from "@client/modules/mint/classes/mint-balance.class";
import { MintKeyset } from "@client/modules/mint/classes/mint-keyset.class";

export class MintBalanceRow {

    unit: string;
    liabilities: number;
    fee: number;
    active: boolean;
    keyset_expiration: number|null;
    reserve_ratio: string;
    assets: number;
    generation: number;

    constructor(balance: MintBalance, keyset: MintKeyset) {
        this.unit = keyset.unit;
        this.liabilities = balance.balance;
        this.fee = keyset.input_fee_ppk;
        this.active = keyset.active;
        this.assets = 150000;
        this.keyset_expiration = this.setKeysetExpiration(keyset);
        this.reserve_ratio = this.setReserveRatio(this.assets); // @todo need ln data here
        this.generation = this.setKeysetGeneration(keyset);
    }

    private setKeysetExpiration(keyset: MintKeyset): number|null {
        if( keyset.valid_from === keyset.valid_to ) return null;
        return keyset.valid_to;
    }

    private setReserveRatio(assets: number = 1000): string {
        const ratio = assets / this.liabilities;
        const formatted_ratio = Number.isInteger(ratio) ? ratio.toString() : (ratio.toFixed(1).endsWith('.0') ? Math.floor(ratio).toString() : ratio.toFixed(1));
        return `${formatted_ratio} : 1`;
    }

    private setKeysetGeneration(keyset: MintKeyset): number {
        if (!keyset.derivation_path) return 0;
        const path_segments = keyset.derivation_path.split('/');
        const last_segment = path_segments[path_segments.length - 1];
        const numeric_part = last_segment.replace(/'/g, '');
        return parseInt(numeric_part) || 0;
    }
}