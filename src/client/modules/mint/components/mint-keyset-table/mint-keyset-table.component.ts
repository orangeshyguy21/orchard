/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Vendor Dependencies */
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
/* Application Dependencies */
import { NonNullableMintKeysetsSettings } from '@client/modules/settings/types/setting.types';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintAnalyticKeyset } from '@client/modules/mint/classes/mint-analytic.class';
/* Local Dependencies */
import { MintKeysetRow } from './mint-keyset-row.class';

@Component({
	selector: 'orc-mint-keyset-table',
	standalone: false,
	templateUrl: './mint-keyset-table.component.html',
	styleUrl: './mint-keyset-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class MintKeysetTableComponent implements OnChanges {

	@ViewChild(MatSort) sort!: MatSort;

	@Input() public keysets!: MintKeyset[];
	@Input() public keysets_analytics!: MintAnalyticKeyset[];
	@Input() public keysets_analytics_pre!: MintAnalyticKeyset[];
	@Input() public page_settings!: NonNullableMintKeysetsSettings;
	@Input() public loading!: boolean;

	public displayed_columns = ['keyset', 'input_fee_ppk', 'valid_from', 'balance'];
  	public data_source!: MatTableDataSource<MintKeysetRow>;

	constructor() {}

	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
	}

	private init() : any {
		const keyset_rows = this.keysets
			.filter(keyset => this.page_settings?.date_end >= keyset.valid_from)
			.filter(keyset => this.page_settings?.status.includes(keyset.active))
			.filter(keyset => this.page_settings?.units.includes(keyset.unit))
			.sort((a, b) => b.derivation_path_index - a.derivation_path_index)
			.map(keyset => {
				const keyset_analytics = this.keysets_analytics.filter(analytic => analytic.keyset_id === keyset.id);
				const keyset_analytics_pre = this.keysets_analytics_pre.filter(analytic => analytic.keyset_id === keyset.id);
				return new MintKeysetRow(keyset, keyset_analytics, keyset_analytics_pre);
			});
		this.data_source = new MatTableDataSource(keyset_rows);
		setTimeout(() => {
			this.data_source.sort = this.sort;
		});
	}
}