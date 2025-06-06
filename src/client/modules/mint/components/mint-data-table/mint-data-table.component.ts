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
	public more_entity!: MintMintQuote | MintMeltQuote | null;

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
		console.log('TOGGLE MORE', this.more_entity);
	}
}

// /* Shared Dependencies */
// import { OrchardMintMeltQuote, MeltQuoteState, MintUnit } from "@shared/generated.types";

// export class MintMeltQuote implements OrchardMintMeltQuote {

// 	public id: string;
//     public unit: MintUnit;
// 	public amount: number;
// 	public request: string;
// 	public fee_reserve: number;
// 	public state: MeltQuoteState;
// 	public payment_preimage: string | null;
// 	public request_lookup_id: string;
// 	public msat_to_pay: number | null;
// 	public created_time: number;
// 	public paid_time: number;

// 	constructor(mint_melt_quote: OrchardMintMeltQuote) {
//         this.id = mint_melt_quote.id;
//         this.unit = mint_melt_quote.unit;
// 		this.amount = mint_melt_quote.amount;
// 		this.request = mint_melt_quote.request;
// 		this.fee_reserve = mint_melt_quote.fee_reserve;
// 		this.state = mint_melt_quote.state;
//         this.payment_preimage = mint_melt_quote.payment_preimage ?? null;
// 		this.request_lookup_id = mint_melt_quote.request_lookup_id;
//         this.msat_to_pay = mint_melt_quote.msat_to_pay ?? null;
// 		this.created_time = mint_melt_quote.created_time;
// 		this.paid_time = mint_melt_quote.paid_time;	
// 	}
// }