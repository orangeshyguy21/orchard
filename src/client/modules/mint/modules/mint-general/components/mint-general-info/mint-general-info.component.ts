/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed, inject} from '@angular/core';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
/* Application Dependencies */
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Components */
import {NetworkConnectionComponent} from '@client/modules/network/components/network-connection/network-connection.component';

type MintUri = {
	uri: string;
	type: string;
	label: string;
};

@Component({
	selector: 'orc-mint-general-info',
	standalone: false,
	templateUrl: './mint-general-info.component.html',
	styleUrl: './mint-general-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralInfoComponent {
	private dialog = inject(MatDialog);

	public loading = input.required<boolean>();
	public icon_data = input.required<string | null>();
	public info = input.required<MintInfo | null>();
	public error = input.required<boolean>();
	public device_type = input.required<DeviceType>();

	public state = computed(() => {
		if (this.error()) return 'offline';
		return 'online';
	});

	public status = computed(() => {
		if (this.error()) return 'inactive';
		return 'active';
	});

	public uris = computed(() => {
		const urls = this.info()?.urls ?? [];
		return urls.map((url) => this.transformUrl(url));
	});

	/** Transforms a mint connection string into a truncated display object */
	private transformUrl(url: string): MintUri {
		const is_tor = url.includes('.onion');
		let label = url;
		try {
			const parsed = new URL(url);
			const host = parsed.hostname;
			label = is_tor ? `${host.split('.onion')[0].slice(0, 15)}...onion` : host;
			if (parsed.port) label += `:${parsed.port}`;
		} catch {
			label = is_tor ? `${url.split('.onion')[0].slice(0, 15)}...onion` : url;
		}
		return {uri: url, type: is_tor ? 'tor' : 'clearnet', label};
	}

	public onUriClick(uri: MintUri): void {
		this.dialog.open(NetworkConnectionComponent, {
			data: {
				uri: uri.uri,
				type: uri.type,
				label: uri.label,
				image: this.icon_data(),
				name: this.info()?.name ?? '',
				device_type: this.device_type(),
			},
		});
	}
}
