/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
/* Application Dependencies */
import { LightningBalance } from '@client/modules/lightning/classes/lightning-balance.class';
import { OrchardError } from '@client/modules/error/types/error.types';
/* Native Module Dependencies */
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
/* Local Dependencies */
import { MintBalanceRow } from './mint-balance-row.class';

@Component({
	selector: 'orc-mint-balance-sheet',
	standalone: false,
	templateUrl: './mint-balance-sheet.component.html',
	styleUrl: './mint-balance-sheet.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
		trigger('fadeIn', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('150ms ease-in', style({ opacity: 1 })),
			]),
		]),
	],
})
export class MintBalanceSheetComponent implements OnChanges {

	@Output() navigate = new EventEmitter<void>();

	@Input() balances!: MintBalance[];
	@Input() keysets!: MintKeyset[];
	@Input() lightning_balance!: LightningBalance | null;
	@Input() lightning_enabled!: boolean;
	@Input() lightning_errors!: OrchardError[];
	@Input() lightning_loading!: boolean;
	@Input() loading!: boolean;

	public rows: MintBalanceRow[] = [];
	public displayed_columns: string[] = ['liabilities', 'assets', 'keyset', 'fees'];

	constructor() {}

	ngOnChanges(): void {
		if( this.loading === false ) this.init();
	}

	private init(): void {
		this.rows = this.getRows();
		if(this.rows[0]?.fees === null) this.displayed_columns = ['liabilities', 'assets', 'keyset'];
	}

	private getAssetBalances(): number {
		if( this.lightning_balance ) {
			return this.lightning_balance.local_balance.sat;
		}
		return 0;
	}

	private getRows(): MintBalanceRow[] {
		const rows_by_unit: Record<string, MintBalanceRow> = {};

		this.keysets
			.map( keyset => {
				const liability_balance = this.balances.find( balance => balance.keyset === keyset.id);
				const asset_balance = this.getAssetBalances();
				return new MintBalanceRow(liability_balance, asset_balance, keyset);
			})
			.filter(row => row !== null)
			.sort((a, b) => b.derivation_path_index - a.derivation_path_index)
			.forEach( row => {
				const unit = row.unit.toLowerCase();
				if (!rows_by_unit[unit]) {
					rows_by_unit[unit] = row;
					return;
				}
				rows_by_unit[unit].liabilities += row.liabilities;
				if( row.fees !== null ) rows_by_unit[unit].fees = (rows_by_unit[unit].fees ?? 0) + row.fees;
			});
		
		return Object.values(rows_by_unit).sort((a, b) => {
			const currency_order: Record<string, number> = { 'btc': 1, 'sat': 2, 'msat': 3, 'usd': 4, 'eur': 5 };
			return (currency_order[a.unit.toLowerCase()] || 999) - (currency_order[b.unit.toLowerCase()] || 999);
		});
	}
}