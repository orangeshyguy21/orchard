/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Application Dependencies */
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';

@Component({
	selector: 'orc-index-subsection-dashboard-bitcoin-header',
	standalone: false,
	templateUrl: './index-subsection-dashboard-bitcoin-header.component.html',
	styleUrl: './index-subsection-dashboard-bitcoin-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardBitcoinHeaderComponent {
	public enabled = input.required<boolean>();
	public enabled_oracle = input.required<boolean>();
	public loading = input.required<boolean>();
	public network_info = input.required<BitcoinNetworkInfo | null>();
	public blockchain_info = input.required<BitcoinBlockchainInfo | null>();
	public error = input.required<boolean>();

	public state = computed(() => {
		if (this.error()) return 'offline';
		if (this.blockchain_info()?.initialblockdownload) return 'syncing';
		return 'online';
	});
}
