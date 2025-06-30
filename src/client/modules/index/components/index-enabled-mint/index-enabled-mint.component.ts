/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Application Dependencies */
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { LightningBalance } from '@client/modules/lightning/classes/lightning-balance.class';
import { OrchardError } from '@client/modules/error/types/error.types';

type Liabilities = {
	unit: string;
	amount: number;
}

@Component({
	selector: 'orc-index-enabled-mint',
	standalone: false,
	templateUrl: './index-enabled-mint.component.html',
	styleUrl: './index-enabled-mint.component.scss',
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
export class IndexEnabledMintComponent implements OnChanges {


  	@Input() loading!: boolean;
	@Input() info!: MintInfo;
	@Input() keysets!: MintKeyset[];
	@Input() balances!: MintBalance[];
	@Input() icon_data!: string | null;
	@Input() lightning_balance!: LightningBalance | null;
	@Input() lightning_enabled!: boolean;
	@Input() lightning_errors!: OrchardError[];
	@Input() lightning_loading!: boolean;

	@Output() navigate: EventEmitter<string> = new EventEmitter<string>();

	public liabilities!: Liabilities[] | null;

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if( changes['loading'] && !this.loading ) {
			this.init();
		}
	}

	private init() : void {
		this.liabilities = this.getLiabilities();
	}

	private getLiabilities(): Liabilities[] | null {
		if (!this.balances || !this.keysets) return null;
		
		const grouped_liabilities = this.balances.reduce((acc, balance) => {
			const keyset = this.keysets.find(k => k.id === balance.keyset);
			if (!keyset) return acc;
			if (!acc[keyset.unit]) {
				acc[keyset.unit] = {
					unit: keyset.unit,
					amount: 0
				};
			}
			acc[keyset.unit].amount += balance.balance;
			return acc;
		}, {} as Record<string, Liabilities>);
		
		return Object.values(grouped_liabilities);
	}
}