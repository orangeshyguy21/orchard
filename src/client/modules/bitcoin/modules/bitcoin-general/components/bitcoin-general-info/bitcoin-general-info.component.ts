/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Application Dependencies */
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';

@Component({
	selector: 'orc-bitcoin-general-info',
	standalone: false,
	templateUrl: './bitcoin-general-info.component.html',
	styleUrl: './bitcoin-general-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinGeneralInfoComponent {
	public blockchain_info = input.required<BitcoinBlockchainInfo | null>();
	public blockcount = input.required<number>();
	public error = input.required<boolean>();

	public state = computed(() => {
		if (this.error()) return 'offline';
		if (this.blockchain_info()?.initialblockdownload) return 'syncing';
		return 'online';
	});

	public status = computed(() => {
		if (this.error()) return 'inactive';
		if (this.blockchain_info()?.initialblockdownload) return 'warning';
		return 'active';
	});
}
