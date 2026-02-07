/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, OnChanges, SimpleChanges} from '@angular/core';
/* Vendor Dependencies */
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {LightningChannel, LightningClosedChannel} from '@client/modules/lightning/classes/lightning-channel.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';
import { BitcoinOraclePrice } from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {DeviceType} from '@client/modules/layout/types/device.types';

type ChannelSummary = {
	size: number;
	recievable: number;
	sendable: number;
	decimal_display: number;
	unit: string;
	asset_id?: string;
};

@Component({
	selector: 'orc-index-subsection-dashboard-lightning-enabled',
	standalone: false,
	templateUrl: './index-subsection-dashboard-lightning-enabled.component.html',
	styleUrl: './index-subsection-dashboard-lightning-enabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardLightningEnabledComponent implements OnChanges {
	public loading = input.required<boolean>();
	public bitcoin_oracle_enabled = input.required<boolean>();
	public bitcoin_oracle_price = input.required<BitcoinOraclePrice | null>();
	public enabled_taproot_assets = input.required<boolean>();
	public lightning_info = input.required<LightningInfo | null>();
	public lightning_balance = input.required<LightningBalance | null>();
	public lightning_channels = input.required<LightningChannel[] | null>();
	public lightning_closed_channels = input.required<LightningClosedChannel[] | null>();
	public taproot_assets = input.required<TaprootAssets | null>();
	public device_type = input.required<DeviceType>();

	public displayed_columns = ['unit', 'receive', 'channel', 'send'];
	public data_source!: MatTableDataSource<ChannelSummary>;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && !this.loading) {
			this.init();
		}
	}

	private init(): void {
		const sat_summary = this.getSatSummary();
		const taproot_assets_summaries = this.getTaprootAssetsSummaries();
		const data = taproot_assets_summaries ? [sat_summary, ...taproot_assets_summaries] : [sat_summary];
		this.data_source = new MatTableDataSource(data);
	}

	private getSatSummary(): ChannelSummary {
		const local_balance = this.lightning_balance()?.local_balance || 0;
		const remote_balance = this.lightning_balance()?.remote_balance || 0;
		return {
			size: local_balance + remote_balance,
			recievable: remote_balance,
			sendable: local_balance,
			unit: 'msat',
			decimal_display: 0,
		};
	}

	private getTaprootAssetsSummaries(): ChannelSummary[] | null {
        const enabled_taproot_assets = this.enabled_taproot_assets();
        const lightning_balance = this.lightning_balance(); 
        const taproot_assets = this.taproot_assets();
		if (!enabled_taproot_assets) return null;
		if (!lightning_balance) return null;
		if (!taproot_assets) return null;

		const grouped_summaries = lightning_balance.custom_channel_data.open_channels.reduce(
			(acc, channel) => {
				const asset_id = channel.asset_id;
				const asset = taproot_assets?.assets.find((asset) => asset.asset_genesis.asset_id === asset_id);
				if (!acc[asset_id]) {
					acc[asset_id] = {
						size: 0,
						recievable: 0,
						sendable: 0,
						unit: channel.name,
						decimal_display: asset ? asset.decimal_display?.decimal_display : 0,
						asset_id: asset_id,
					};
				}
				const size = (channel.local_balance + channel.remote_balance) / Math.pow(10, acc[asset_id].decimal_display);
				acc[asset_id].size += size;
				acc[asset_id].recievable += channel.remote_balance / Math.pow(10, acc[asset_id].decimal_display);
				acc[asset_id].sendable += channel.local_balance / Math.pow(10, acc[asset_id].decimal_display);
				return acc;
			},
			{} as Record<string, ChannelSummary>,
		);

		return Object.values(grouped_summaries);
	}
}
