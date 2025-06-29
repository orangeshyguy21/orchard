/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Application Dependencies */
import { BitcoinNetworkInfo } from '@client/modules/bitcoin/classes/bitcoin-network-info.class';

@Component({
	selector: 'orc-index-header-bitcoin',
	standalone: false,
	templateUrl: './index-header-bitcoin.component.html',
	styleUrl: './index-header-bitcoin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexHeaderBitcoinComponent {

  	@Input() loading!: boolean;
  	@Input() network_info!: BitcoinNetworkInfo;

}
