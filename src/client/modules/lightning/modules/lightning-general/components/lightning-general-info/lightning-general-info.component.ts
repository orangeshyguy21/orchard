/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed, inject} from '@angular/core';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Components */
import {LightningGeneralConnectionComponent} from '@client/modules/lightning/modules/lightning-general/components/lightning-general-connection/lightning-general-connection.component';

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
		// const uris = this.lightning_info()?.uris ?? [];
		const uris = [
			'03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@3.33.236.230:9735',
			'03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@of7husrflx7sforh3fw6yqlpwstee3wg5imvvmkp4bz6rbjxtg5nljad.onion:9735',
		];
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
		this.dialog.open(LightningGeneralConnectionComponent, {
			data: {
				uri: uri.uri,
				type: uri.type,
				label: uri.label,
				color: this.lightning_info()?.color,
				name: this.lightning_info()?.alias,
				device_type: this.device_type(),
			},
		});
	}
}
