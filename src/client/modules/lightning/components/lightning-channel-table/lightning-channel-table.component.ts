/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
/* Vendor Dependencies */
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';

type ChannelSummary = {
	size: number;
	recievable: number;
	sendable: number;
	decimal_display: number;
	unit: string;
	asset_id?: string;
};

@Component({
	selector: 'orc-lightning-channel-table',
	standalone: false,
	templateUrl: './lightning-channel-table.component.html',
	styleUrl: './lightning-channel-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightningChannelTableComponent implements OnInit {
	@Input() enabled_taproot_assets!: boolean;
	@Input() lightning_balance!: LightningBalance | null;
	@Input() taproot_assets!: TaprootAssets | null;

	public displayed_columns = ['unit', 'receive', 'channel', 'send'];
	public data_source!: MatTableDataSource<ChannelSummary>;

	ngOnInit(): void {
		this.init();
	}

	private init(): void {
		const sat_summary = this.getSatSummary();
		const taproot_assets_summaries = this.getTaprootAssetsSummaries();
		const data = taproot_assets_summaries ? [sat_summary, ...taproot_assets_summaries] : [sat_summary];
		this.data_source = new MatTableDataSource(data);
	}

	private getSatSummary(): ChannelSummary {
		const local_balance = this.lightning_balance?.local_balance.sat || 0;
		const remote_balance = this.lightning_balance?.remote_balance.sat || 0;
		return {
			size: local_balance + remote_balance,
			recievable: remote_balance,
			sendable: local_balance,
			unit: 'sat',
			decimal_display: 0,
		};
	}

	private getTaprootAssetsSummaries(): ChannelSummary[] | null {
		if (!this.enabled_taproot_assets) return null;
		if (!this.lightning_balance) return null;
		if (!this.taproot_assets) return null;

		const grouped_summaries = this.lightning_balance.custom_channel_data.open_channels.reduce(
			(acc, channel) => {
				const asset_id = channel.asset_id;
				const asset = this.taproot_assets?.assets.find((asset) => asset.asset_genesis.asset_id === asset_id);
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
