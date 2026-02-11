/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed, inject} from '@angular/core';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {PublicPort} from '@client/modules/public/classes/public-port.class';
/* Components */
import {NetworkConnectionComponent} from '@client/modules/network/components/network-connection/network-connection.component';

type LightningUri = {
	uri: string;
	type: string;
	label: string;
};

@Component({
	selector: 'orc-lightning-general-info',
	standalone: false,
	templateUrl: './lightning-general-info.component.html',
	styleUrl: './lightning-general-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightningGeneralInfoComponent {
	private dialog = inject(MatDialog);

	public lightning_info = input.required<LightningInfo | null>();
	public error = input.required<boolean>();
	public device_type = input.required<DeviceType>();
	public connections = input<PublicPort[]>([]);

	public connections_status_map = computed(() => {
		const map = new Map<string, string>();
		for (const result of this.connections()) {
			map.set(`${result.host}:${result.port}`, result.connection_status);
		}
		return map;
	});

	public syncing = computed(() => {
		return !this.lightning_info()?.synced_to_chain || !this.lightning_info()?.synced_to_graph;
	});

	public state = computed(() => {
		if (this.error()) return 'offline';
		if (this.syncing()) return 'syncing';
		return 'online';
	});

	public status = computed(() => {
		if (this.error()) return 'inactive';
		if (this.syncing()) return 'warning';
		return 'active';
	});

	public open_channels = computed(() => {
		const active_channels = this.lightning_info()?.num_active_channels ?? 0;
		const inactive_channels = this.lightning_info()?.num_inactive_channels ?? 0;
		return active_channels + inactive_channels;
	});

	public uris = computed(() => {
		const uris = this.lightning_info()?.uris ?? [];
		return uris.map((uri) => this.transformUri(uri));
	});

	/** Transforms a raw Lightning URI into a truncated display object */
	private transformUri(uri: string): {uri: string; type: string; label: string} {
		const [pubkey, address] = uri.split('@');
		const truncated_pubkey = pubkey.slice(0, 11);
		const is_tor = address?.includes('.onion');
		const truncated_address = is_tor ? `${address.split('.onion')[0].slice(0, 7)}...onion:${address.split(':').pop()}` : address;
		return {
			uri,
			type: is_tor ? 'tor' : 'clearnet',
			label: `${truncated_pubkey}...@${truncated_address}`,
		};
	}

	public onUriClick(uri: LightningUri): void {
		const address = uri.uri.split('@')[1];
		this.dialog.open(NetworkConnectionComponent, {
			data: {
				uri: uri.uri,
				type: uri.type,
				label: uri.label,
				image: this.createCircleSvg(this.lightning_info()?.color ?? '#000000'),
				name: this.lightning_info()?.alias,
				section: 'lightning',
				status: this.connections_status_map().get(address) ?? null,
				device_type: this.device_type(),
			},
		});
	}

	/** Creates an SVG circle data URI for use as a QR code center image */
	private createCircleSvg(color: string): string {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${color}"/></svg>`;
		return `data:image/svg+xml;base64,${btoa(svg)}`;
	}
}
