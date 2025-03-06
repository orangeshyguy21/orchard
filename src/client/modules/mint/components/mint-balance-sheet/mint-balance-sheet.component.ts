/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
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
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintBalanceSheetComponent implements OnChanges {

	@Input() balances!: MintBalance[];
	@Input() keysets!: MintKeyset[];
	@Input() loading!: boolean;

	public rows: MintBalanceRow[] = [];
	public displayed_columns: string[] = ['Liabilities', 'Assets', 'Fee', 'Keyset Expiration'];

	constructor() {}

	ngOnChanges(): void {
		if( this.loading === false ) this.init();
	}

	private init(): void {
		this.rows = this.getRows();
	}

	private getRows(): MintBalanceRow[] {
		return this.balances.map( balance => {
			const keyset = this.keysets.find(keyset => keyset.id === balance.keyset);
			if( !keyset ) return null;
			return new MintBalanceRow(balance, keyset);
		})
		.filter(row => row !== null)
		.sort((a, b) => {
			const currency_order: {[key: string]: number} = { 'sat': 1, 'usd': 2, 'eur': 3 };
			const a_order = currency_order[a.unit.toLowerCase()] || 999; // Default high value for unknown currencies
			const b_order = currency_order[b.unit.toLowerCase()] || 999;
			return a_order - b_order;
		});
	}
}