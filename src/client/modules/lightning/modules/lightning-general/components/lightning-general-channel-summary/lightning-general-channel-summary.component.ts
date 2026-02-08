/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, OnInit, signal, computed} from '@angular/core';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {LightningChannel, LightningClosedChannel} from '@client/modules/lightning/classes/lightning-channel.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {oracleConvertToUSDCents} from '@client/modules/bitcoin/helpers/oracle.helpers';
import {DeviceType} from '@client/modules/layout/types/device.types';

type ChannelSummary = {
	size: number;
	remote: number;
	local: number;
	unit: string;
	group_key?: string;
	channel_count: number;
	channel_closed_count: number;
	channel_active_count: number;
	avg_channel_size: number;
	is_bitcoin: boolean;
	size_oracle: number | null;
	remote_oracle: number | null;
	local_oracle: number | null;
};

@Component({
	selector: 'orc-lightning-general-channel-summary',
	standalone: false,
	templateUrl: './lightning-general-channel-summary.component.html',
	styleUrl: './lightning-general-channel-summary.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightningGeneralChannelSummaryComponent implements OnInit {
	public lightning_info = input.required<LightningInfo | null>();
	public lightning_channels = input.required<LightningChannel[] | null>();
	public lightning_closed_channels = input.required<LightningClosedChannel[] | null>();
	public enabled_taproot_assets = input.required<boolean>();
	public taproot_assets = input.required<TaprootAssets | null>();
	public bitcoin_oracle_enabled = input.required<boolean>();
	public bitcoin_oracle_price = input.required<BitcoinOraclePrice | null>();
	public device_type = input.required<DeviceType>();

	private summaries: Record<string, ChannelSummary[]> = {
		open: [],
		active: [],
	};

	public expanded = signal<Record<string, boolean>>({});
	public summary_type = signal<'open' | 'active'>('open');

	public rows = computed(() => {
		return this.summaries[this.summary_type()];
	});

	ngOnInit(): void {
		this.init();
	}

	private init(): void {
		const sat_summary_open = this.getSatSummary(false);
		const sat_summary_active = this.getSatSummary(true);
		const taproot_summaries_open = this.getTaprootAssetsSummaries(false);
		const taproot_summaries_active = this.getTaprootAssetsSummaries(true);
		this.summaries['open'] = [...sat_summary_open, ...taproot_summaries_open];
		this.summaries['active'] = [...sat_summary_active, ...taproot_summaries_active];
	}

	/**
	 * Builds the sat/msat channel summary row
	 */
	private getSatSummary(active: boolean): ChannelSummary[] {
		const lightning_channels = this.lightning_channels();
		const lightning_closed_channels = this.lightning_closed_channels();
		const sat_channels = lightning_channels?.filter((channel) => !channel.asset);
		const closed_sat_channels = lightning_closed_channels?.filter((channel) => !channel.asset);
		if (!sat_channels) return [];
		const summing_channels = active ? sat_channels?.filter((channel) => channel.active) : sat_channels;
		const local_balance = summing_channels?.reduce((acc, channel) => acc + channel.local_balance || 0, 0);
		const remote_balance = summing_channels?.reduce((acc, channel) => acc + channel.remote_balance || 0, 0);
		if (local_balance === 0 && remote_balance === 0) return [];
		const channel_count = summing_channels?.length || 0;
		const closed_channel_count = closed_sat_channels?.length || 0;
		const active_channel_count = summing_channels?.filter((channel) => channel.active).length || 0;
		const size = summing_channels?.reduce((acc, channel) => acc + channel.capacity || 0, 0);
		const oracle_price = this.bitcoin_oracle_price()?.price || null;
		const size_oracle = oracle_price ? oracleConvertToUSDCents(size, oracle_price, 'sat') : null;
		const remote_oracle = oracle_price ? oracleConvertToUSDCents(remote_balance, oracle_price, 'sat') : null;
		const local_oracle = oracle_price ? oracleConvertToUSDCents(local_balance, oracle_price, 'sat') : null;
		return [
			{
				size,
				remote: remote_balance,
				local: local_balance,
				unit: 'sat',
				channel_count: channel_count,
				channel_closed_count: closed_channel_count,
				channel_active_count: active_channel_count,
				avg_channel_size: channel_count > 0 ? size / channel_count : 0,
				is_bitcoin: true,
				size_oracle,
				remote_oracle,
				local_oracle,
			},
		];
	}

	/**
	 * Builds channel summaries for taproot assets, grouped by group_key
	 */
	private getTaprootAssetsSummaries(active: boolean): ChannelSummary[] {
		const lightning_channels = this.lightning_channels();
		const lightning_closed_channels = this.lightning_closed_channels();
		const enabled_taproot_assets = this.enabled_taproot_assets();
		if (!enabled_taproot_assets) return [];
		if (!lightning_channels) return [];
		const asset_channels = lightning_channels.filter((channel) => channel.asset);
		const closed_asset_channels = lightning_closed_channels?.filter((channel) => channel.asset);
		const active_asset_channels = asset_channels.filter((channel) => channel.active);
		const summing_channels = active ? active_asset_channels : asset_channels;
		const grouped_summaries = summing_channels.reduce(
			(acc, channel) => {
				const asset = channel.asset!;
				const asset_key = asset.group_key || asset.asset_id;
				if (!acc[asset_key]) {
					acc[asset_key] = {
						size: 0,
						remote: 0,
						local: 0,
						unit: asset.name,
						group_key: asset_key,
						channel_count: 0,
						channel_closed_count: 0,
						channel_active_count: 0,
						avg_channel_size: 0,
						is_bitcoin: false,
						size_oracle: null,
						remote_oracle: null,
						local_oracle: null,
					};
				}
				const divisor = Math.pow(10, asset.decimal_display);
				const size = (asset.local_balance + asset.remote_balance) / divisor;
				acc[asset_key].size += size;
				acc[asset_key].remote += asset.remote_balance / divisor;
				acc[asset_key].local += asset.local_balance / divisor;
				acc[asset_key].channel_count += 1;
				return acc;
			},
			{} as Record<string, ChannelSummary>,
		);

		closed_asset_channels?.forEach((channel) => {
			const asset_key = channel.asset!.group_key || channel.asset!.asset_id;
			if (grouped_summaries[asset_key]) {
				grouped_summaries[asset_key].channel_closed_count += 1;
			}
		});

		active_asset_channels?.forEach((channel) => {
			const asset_key = channel.asset!.group_key || channel.asset!.asset_id;
			if (grouped_summaries[asset_key]) {
				grouped_summaries[asset_key].channel_active_count += 1;
			}
		});

		return Object.values(grouped_summaries).map((summary) => ({
			...summary,
			avg_channel_size: summary.channel_count > 0 ? summary.size / summary.channel_count : 0,
		}));
	}

	/** Toggles the expanded state for a given unit row */
	public toggleExpanded(unit: string): void {
		this.expanded.update((state) => ({...state, [unit]: !state[unit]}));
	}
}
