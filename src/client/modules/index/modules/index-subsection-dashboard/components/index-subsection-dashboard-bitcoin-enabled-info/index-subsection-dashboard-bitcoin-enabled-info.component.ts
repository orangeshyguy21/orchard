/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Application Dependencies */
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';

@Component({
	selector: 'orc-index-subsection-dashboard-bitcoin-enabled-info',
	standalone: false,
	templateUrl: './index-subsection-dashboard-bitcoin-enabled-info.component.html',
	styleUrl: './index-subsection-dashboard-bitcoin-enabled-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardBitcoinEnabledInfoComponent {
	@Input() blockchain_info!: BitcoinBlockchainInfo | null;
	@Input() blockcount!: number;
}
