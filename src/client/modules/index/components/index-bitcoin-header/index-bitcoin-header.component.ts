/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, computed} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
/* Application Dependencies */
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';

@Component({
	selector: 'orc-index-bitcoin-header',
	standalone: false,
	templateUrl: './index-bitcoin-header.component.html',
	styleUrl: './index-bitcoin-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class IndexBitcoinHeaderComponent {
	@Input() loading!: boolean;
	@Input() network_info!: BitcoinNetworkInfo | null;
	@Input() blockchain_info!: BitcoinBlockchainInfo | null;
	@Input() error!: boolean;

	public state = computed(() => {
		if (this.error) return 'offline';
		if (this.blockchain_info?.initialblockdownload) return 'syncing';
		return 'online';
	});
}
