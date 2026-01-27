/* Application Dependencies */
import {LocalAmountPipe} from '@client/modules/local/pipes/local-amount/local-amount.pipe';

/* Native Dependencies */
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';

export class MintGeneralBalanceRow {
	unit: string;
	liabilities: number;
	input_fee_ppk: number;
	active: boolean;
	derivation_path_index: number;
	first_seen: number;
	assets: number | null;
	fees: number | null;

    public get reserve(): number | null {
		if (this.assets === null) return null;
		const percentage = LocalAmountPipe.getConvertedAmount(this.unit, this.liabilities) / this.assets;
		if (percentage === Infinity) return 0;
		return Math.ceil(percentage * 100) / 100;
	}

	constructor(balance: MintBalance | undefined, assets: number | null, keyset: MintKeyset) {
		this.unit = keyset.unit;
		this.liabilities = balance?.balance ?? 0;
		this.fees = keyset.fees_paid ?? null;
		this.input_fee_ppk = keyset.input_fee_ppk;
		this.active = keyset.active;
		this.assets = assets;
		this.derivation_path_index = keyset.derivation_path_index;
		this.first_seen = keyset.valid_from;
	}
}
