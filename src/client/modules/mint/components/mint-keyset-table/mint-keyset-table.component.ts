/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
/* Vendor Dependencies */
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';

@Component({
	selector: 'orc-mint-keyset-table',
	standalone: false,
	templateUrl: './mint-keyset-table.component.html',
	styleUrl: './mint-keyset-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintKeysetTableComponent implements OnChanges, AfterViewInit {

	@ViewChild(MatSort) sort!: MatSort;

	@Input() public keysets!: MintKeyset[];
	@Input() public loading!: boolean;

	public displayed_columns = ['keyset', 'unit', 'id', 'input_fee_ppk', 'valid_from', 'balance'];
  	public data_source!: MatTableDataSource<MintKeyset>;

	constructor() {}

	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
	}

	public ngAfterViewInit(): void {
		this.data_source.sort = this.sort;
	}

	private init() : void {
		const sorted_keysets = this.keysets.sort((a, b) => b.valid_from - a.valid_from);
		this.data_source = new MatTableDataSource(sorted_keysets);
		this.data_source.sort = this.sort;
	}
}