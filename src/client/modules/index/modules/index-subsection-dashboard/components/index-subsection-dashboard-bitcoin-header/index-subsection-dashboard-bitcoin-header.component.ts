/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Application Dependencies */
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';

@Component({
	selector: 'orc-index-subsection-dashboard-bitcoin-header',
	standalone: false,
	templateUrl: './index-subsection-dashboard-bitcoin-header.component.html',
	styleUrl: './index-subsection-dashboard-bitcoin-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardBitcoinHeaderComponent {
	public enabled = input.required<boolean>();
	public loading = input.required<boolean>();
	public network_info = input.required<BitcoinNetworkInfo | null>();
	public device_desktop = input.required<boolean>();

	constructor() {}
}
