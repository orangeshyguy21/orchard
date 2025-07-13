/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Application Dependencies */
import { BitcoinBlockchainInfo } from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';

@Component({
	selector: 'orc-index-bitcoin-info',
	standalone: false,
	templateUrl: './index-bitcoin-info.component.html',
	styleUrl: './index-bitcoin-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexBitcoinInfoComponent {

	@Input() blockchain_info!: BitcoinBlockchainInfo | null;
	@Input() blockcount!: number;

}
