/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Vendor Dependencies */
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
/* Application Dependencies */
import { NonNullableMintDatabaseSettings } from '@client/modules/chart/services/chart/chart.types';
/* Native Dependencies */
import { MintData } from '@client/modules/mint/components/mint-subsection-database/mint-subsection-database.component';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';
/* Local Dependencies */
// import { MintKeysetRow } from './mint-keyset-row.class';



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
	@Input() public chart_settings!: NonNullableMintDatabaseSettings;
	@Input() public loading!: boolean;

	public displayed_columns = ['unit', 'amount', 'request', 'state', 'created_time'];
  	public data_source!: MatTableDataSource<MintMintQuote>;
	public more_entity!: MintMintQuote | null;

	constructor() {}

	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
	}

	private init() : any {
		this.data_source = new MatTableDataSource(this.data.entities as MintMintQuote[]);
		setTimeout(() => {
			this.data_source.sort = this.sort;
		});
	}

	public toggleMore(entity: MintMintQuote) {
		this.more_entity = this.more_entity === entity ? null : entity;
	}
}


// /* Shared Dependencies */
// import { OrchardMintMintQuote, MintQuoteState, MintUnit } from "@shared/generated.types";

// export class MintMintQuote implements OrchardMintMintQuote {

// 	public id: string;
// 	public amount: number;
// 	public unit: MintUnit;
// 	public request: string;
// 	public state: MintQuoteState;
// 	public request_lookup_id: string;
// 	public pubkey: string;
// 	public issued_time: number | null;
// 	public created_time: number | null;
// 	public paid_time: number | null;

// 	constructor(mint_mint_quote: OrchardMintMintQuote) {
//         this.id = mint_mint_quote.id;
// 		this.amount = mint_mint_quote.amount;
// 		this.unit = mint_mint_quote.unit;
// 		this.request = mint_mint_quote.request;
// 		this.state = mint_mint_quote.state;
// 		this.request_lookup_id = mint_mint_quote.request_lookup_id;
// 		this.pubkey = mint_mint_quote.pubkey;
// 		this.issued_time = mint_mint_quote.issued_time ?? null;
// 		this.created_time = mint_mint_quote.created_time ?? null;
// 		this.paid_time = mint_mint_quote.paid_time ?? null;
// 	}
// }