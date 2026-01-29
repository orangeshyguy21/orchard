/* Application Dependencies */
import {LocalAmountPipe} from '@client/modules/local/pipes/local-amount/local-amount.pipe';
/* Native Dependencies */
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
/* Shared Dependencies */
import {MintUnit} from '@shared/generated.types';

export class MintGeneralBalanceRow {
    unit_lightning: string;
	unit_mint: string;
	liabilities: number;
    liabilities_oracle: number | null;
	input_fee_ppk: number;
	active: boolean;
	derivation_path_index: number;
	first_seen: number;
	assets: number | null;
    assets_oracle: number | null;
	fees: number | null;
    fees_oracle: number | null;
	is_bitcoin: boolean;

	public get reserve(): number | null {
		if (this.assets === null) return null;
		const liabilities = LocalAmountPipe.getConvertedAmount(this.unit_mint, this.liabilities);
		if (liabilities === 0) return null;
		const multiple = Math.ceil(this.assets / 1000) / liabilities;
		if (multiple < 5) return Math.round(multiple * 10) / 10;
		return Math.round(multiple);
	}

	constructor(balance: MintBalance | undefined, assets: {balance: number | null, balance_oracle: number | null}, keyset: MintKeyset) {
        this.unit_lightning = 'msat';
		this.unit_mint = keyset.unit;
		this.liabilities = balance?.balance ?? 0;
        this.liabilities_oracle = balance?.balance_oracle ?? null;
		this.fees = keyset.fees_paid ?? null;
        this.fees_oracle = keyset.fees_paid_oracle ?? null;
		this.input_fee_ppk = keyset.input_fee_ppk;
		this.active = keyset.active;
		this.assets = assets.balance;
        this.assets_oracle = assets.balance_oracle;
		this.derivation_path_index = keyset.derivation_path_index;
		this.first_seen = keyset.valid_from;
		this.is_bitcoin = this.getIsBitcoin();
	}

	private getIsBitcoin(): boolean {
		return this.unit_mint === MintUnit.Btc || this.unit_mint === MintUnit.Sat || this.unit_mint === MintUnit.Msat;
	}
}
