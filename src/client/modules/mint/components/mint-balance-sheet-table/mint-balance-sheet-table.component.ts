/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
/* Native Module Dependencies */
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
/* Local Dependencies */
import { MintBalanceTableRow } from './mint-balance-sheet-table-row.class';

@Component({
	selector: 'orc-mint-balance-sheet-table',
	standalone: false,
	templateUrl: './mint-balance-sheet-table.component.html',
	styleUrl: './mint-balance-sheet-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintBalanceSheetTableComponent implements OnChanges {

	@Input() balances!: MintBalance[];
	@Input() keysets!: MintKeyset[];

	public loading: boolean = true;
	public rows: MintBalanceTableRow[] = [];
	public displayed_columns: string[] = ['Liabilities', 'Assets', 'Fee', 'Keyset Expiration'];

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['balances'] || changes['keysets']) {
			if( !this.balances || !this.keysets ) return;
			this.init();
		}
	}

	private init(): void {
		this.loading = false;
		this.rows = this.getRows();
	}

	private getRows(): MintBalanceTableRow[] {
		return this.balances.map( balance => {
			const keyset = this.keysets.find(keyset => keyset.id === balance.keyset);
			if( !keyset ) return null;
			return new MintBalanceTableRow(balance, keyset);
		}).filter(row => row !== null);
	}
}