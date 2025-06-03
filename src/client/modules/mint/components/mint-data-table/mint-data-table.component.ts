/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Vendor Dependencies */
import { MatSort } from '@angular/material/sort';
/* Application Dependencies */
import { NonNullableMintDatabaseSettings } from '@client/modules/settings/types/setting.types';
/* Native Dependencies */
import { MintData } from '@client/modules/mint/components/mint-subsection-database/mint-subsection-database.component';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';

@Component({
	selector: 'orc-mint-data-table',
	standalone: false,
	templateUrl: './mint-data-table.component.html',
	styleUrl: './mint-data-table.component.scss',
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
export class MintDataTableComponent implements OnChanges {

	@ViewChild(MatSort) sort!: MatSort;

	@Input() public data!: MintData;
	@Input() public page_settings!: NonNullableMintDatabaseSettings;
	@Input() public loading!: boolean;

	public displayed_columns = ['unit', 'amount', 'request', 'state', 'created_time'];
	public more_entity!: MintMintQuote | null;

	constructor() {}

	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
	}

	private init() : any {
		setTimeout(() => {
			this.data.source.sort = this.sort;
		});
	}

	public toggleMore(entity: MintMintQuote) {
		this.more_entity = this.more_entity === entity ? null : entity;
	}
}