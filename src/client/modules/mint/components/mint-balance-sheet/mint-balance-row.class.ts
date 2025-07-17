/* Application Dependencies */
import {AmountPipe} from '@client/modules/local/pipes/amount/amount.pipe';

/* Native Dependencies */
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';

export class MintBalanceRow {
	unit: string;
	liabilities: number;
	input_fee_ppk: number;
	active: boolean;
	derivation_path_index: number;
	first_seen: number;
	assets: number;
	fees: number | null;

	public get reserve_ratio(): string {
		const ratio = this.assets / AmountPipe.getConvertedAmount(this.unit, this.liabilities);
		if (ratio === Infinity) return '∞ : 1';
		let formatted_ratio: string;
		if (ratio > 3) {
			formatted_ratio = Math.round(ratio).toString();
		} else {
			formatted_ratio = Number.isInteger(ratio)
				? ratio.toString()
				: ratio.toFixed(1).endsWith('.0')
					? Math.floor(ratio).toString()
					: ratio.toFixed(1);
		}
		return `${formatted_ratio} : 1`;
	}

	constructor(balance: MintBalance | undefined, assets: number, keyset: MintKeyset) {
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
