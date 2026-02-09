/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Application Dependencies */
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';

type BitcoinUri = {
	uri: string;
	type: string;
	label: string;
};

@Component({
	selector: 'orc-bitcoin-general-info',
	standalone: false,
	templateUrl: './bitcoin-general-info.component.html',
	styleUrl: './bitcoin-general-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinGeneralInfoComponent {
	public blockchain_info = input.required<BitcoinBlockchainInfo | null>();
	public network_info = input.required<BitcoinNetworkInfo | null>();
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

	public uris = computed(() => {
		const addresses = this.network_info()?.localaddresses ?? [];
		return addresses.map((addr) => this.transformAddress(addr));
	});

	/** Transforms a Bitcoin network address into a truncated display object */
	private transformAddress(addr: {address: string; port: number}): BitcoinUri {
		const uri = `${addr.address}:${addr.port}`;
		const is_tor = addr.address.includes('.onion');
		const label = is_tor ? `${addr.address.split('.onion')[0].slice(0, 15)}...onion:${addr.port}` : uri;
		return {
			uri,
			type: is_tor ? 'tor' : 'clearnet',
			label,
		};
	}

	public onUriClick(uri: BitcoinUri): void {
		console.log('uri', uri);
		// this.dialog.open(LightningGeneralConnectionComponent, {
		// 	data: {
		// 		uri: uri.uri,
		// 		type: uri.type,
		// 		label: uri.label,
		// 		color: this.lightning_info()?.color,
		// 		name: this.lightning_info()?.alias,
		// 		device_type: this.device_type(),
		// 	},
		// });
	}
}
