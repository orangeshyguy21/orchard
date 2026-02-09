/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject, input, computed} from '@angular/core';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
/* Application Dependencies */
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Components */
import {NetworkConnectionComponent} from '@client/modules/network/components/network-connection/network-connection.component';

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
	private dialog = inject(MatDialog);

	public blockchain_info = input.required<BitcoinBlockchainInfo | null>();
	public network_info = input.required<BitcoinNetworkInfo | null>();
	public blockcount = input.required<number>();
	public error = input.required<boolean>();
	public device_type = input.required<DeviceType>();

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
		this.dialog.open(NetworkConnectionComponent, {
			data: {
				uri: uri.uri,
				type: uri.type,
				label: uri.label,
				image: this.createBlockSvg('#000000'),
				name: 'bitcoin_node',
				device_type: this.device_type(),
			},
		});
	}

	/** Creates a block SVG data URI for use as a QR code center image */
	private createBlockSvg(color: string): string {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${color}"><path d="M437-115 183-261q-20-11-31.5-31.5T140-336v-287q0-23 11.5-43.5T183-698l254-146q20-11 43-11t43 11l253 146q20 11 31.5 31.5T819-623v287q0 23-11.5 43.5T776-261L523-115q-20 11-43 11t-43-11Zm17-348v294l12 7q7 4 14 4t14-4l13-8v-294l258-150v-14q0-5-2.5-10t-7.5-8l-20-12-255 148-255-148-21 12q-5 3-7.5 8t-2.5 10v13l260 152Z"/></svg>`;
		return `data:image/svg+xml;base64,${btoa(svg)}`;
	}
}
