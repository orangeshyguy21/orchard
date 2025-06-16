/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Application Dependencies */
import { LightningInfo } from '@client/modules/lightning/classes/lightning-info.class';
import { LightningBalance } from '@client/modules/lightning/classes/lightning-balance.class';

type Channel = {
	total: number;
	recievable: number;
	spendable: number;
}

@Component({
	selector: 'orc-index-enabled-lightning',
	standalone: false,
	templateUrl: './index-enabled-lightning.component.html',
	styleUrl: './index-enabled-lightning.component.scss',
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
export class IndexEnabledLightningComponent implements OnChanges {

	@Input() loading!: boolean;
	@Input() enabled_taproot_assets!: boolean;
	@Input() lightning_info!: LightningInfo;
	@Input() lightning_balance!: LightningBalance;

	ngOnChanges(changes: SimpleChanges): void {
		if( changes['loading'] && !this.loading ) {
			// this.balances_hot = this.getHotBalances();
			// console.log('balances_hot', this.balances_hot);
		}
	}
}