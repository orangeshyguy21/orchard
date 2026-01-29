/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, effect, signal} from '@angular/core';
/* Application Dependencies */
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {OrchardError} from '@client/modules/error/types/error.types';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Native Module Dependencies */
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
/* Local Dependencies */
import {MintGeneralBalanceRow} from './mint-general-balance-row.class';
/* Shared Dependencies */
import {MintUnit} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-general-balance-sheet',
	standalone: false,
	templateUrl: './mint-general-balance-sheet.component.html',
	styleUrl: './mint-general-balance-sheet.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralBalanceSheetComponent {
	public navigate = output<void>();

	public balances = input.required<MintBalance[]>();
	public keysets = input.required<MintKeyset[]>();
	public lightning_balance = input.required<LightningBalance | null>();
	public lightning_enabled = input.required<boolean>();
	public lightning_errors = input<OrchardError[]>([]);
	public lightning_loading = input.required<boolean>();
	public bitcoin_oracle_enabled = input.required<boolean>();
	public loading = input.required<boolean>();
	public device_type = input.required<DeviceType>();

	public expanded = signal<Record<string, boolean>>({});
	public rows = signal<MintGeneralBalanceRow[]>([]);

	constructor() {
		effect(() => {
			if (this.loading() !== false) return;
			this.init();
		});
	}

	private init(): void {
		const rows = this.getRows();
		this.rows.set(rows);
	}

	private getAssetBalances(unit: MintUnit): {balance: number | null, balance_oracle: number | null} {
		const lightning_balance = this.lightning_balance();
		if (unit === MintUnit.Eur || unit === MintUnit.Usd) return {balance: null, balance_oracle: null};
		if (lightning_balance) return {balance: lightning_balance.local_balance, balance_oracle: lightning_balance.local_balance_oracle};
		return {balance: null, balance_oracle: null};
	}

	private getRows(): MintGeneralBalanceRow[] {
		const rows_by_unit: Record<string, MintGeneralBalanceRow> = {};
		const keysets = this.keysets();
		const balances = this.balances();
		if (!keysets) return [];
		keysets
			.map((keyset) => {
				const liability_balance = balances.find((balance) => balance.keyset === keyset.id);
				const asset_balance = this.getAssetBalances(keyset.unit);
				return new MintGeneralBalanceRow(liability_balance, asset_balance, keyset);
			})
			.filter((row) => row !== null)
			.sort((a, b) => b.derivation_path_index - a.derivation_path_index)
			.forEach((row) => {
				const unit = row.unit_mint.toLowerCase();
				if (!rows_by_unit[unit]) {
					rows_by_unit[unit] = row;
					return;
				}
				rows_by_unit[unit].liabilities += row.liabilities;
				if (row.fees !== null) rows_by_unit[unit].fees = (rows_by_unit[unit].fees ?? 0) + row.fees;
			});

		return Object.values(rows_by_unit).sort((a, b) => {
			const currency_order: Record<string, number> = {btc: 1, sat: 2, msat: 3, usd: 4, eur: 5};
			return (currency_order[a.unit_mint.toLowerCase()] || 999) - (currency_order[b.unit_mint.toLowerCase()] || 999);
		});
	}

	/** Toggles the expanded state for a given unit row */
	public toggleExpanded(unit: string): void {
		this.expanded.update((state) => ({...state, [unit]: !state[unit]}));
	}
}
