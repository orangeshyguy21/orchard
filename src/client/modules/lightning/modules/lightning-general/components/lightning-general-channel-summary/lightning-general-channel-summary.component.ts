/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
/* Application Dependencies */
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';
import { BitcoinOraclePrice } from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {oracleConvertToUSDCents} from '@client/modules/bitcoin/helpers/oracle.helpers';
import {DeviceType} from '@client/modules/layout/types/device.types';

type ChannelSummary = {
	size: number;
	remote: number;
	local: number;
	unit: string;
	asset_id?: string;
	channel_count: number;
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
	public enabled_taproot_assets = input.required<boolean>();
	public lightning_balance = input.required<LightningBalance | null>();
	public taproot_assets = input.required<TaprootAssets | null>();
	public bitcoin_oracle_enabled = input.required<boolean>();
	public bitcoin_oracle_price = input.required<BitcoinOraclePrice | null>();
	public device_type = input.required<DeviceType>();

	public rows = signal<ChannelSummary[]>([]);
    public expanded = signal<Record<string, boolean>>({});

	ngOnInit(): void {
		this.init();
	}

	private init(): void {
		const taproot_summaries = this.getTaprootAssetsSummaries();
		const sat_summary = this.getSatSummary(taproot_summaries);
		const data = taproot_summaries ? [...sat_summary, ...taproot_summaries] : [...sat_summary];
		this.rows.set(data);
	}

	/**
	 * Builds the sat/msat channel summary row
	 * @param taproot_summaries - Taproot asset summaries to subtract from total channel count
	 */
	private getSatSummary(taproot_summaries: ChannelSummary[] | null): ChannelSummary[] {
		const local_balance = this.lightning_balance()?.local_balance || 0;
		const remote_balance = this.lightning_balance()?.remote_balance || 0;
		if (local_balance === 0 && remote_balance === 0) return [];
		const total_channels = this.lightning_info()?.num_active_channels || 0;
		const taproot_channel_count = taproot_summaries?.reduce((acc, s) => acc + s.channel_count, 0) || 0;
		const sat_channel_count = total_channels - taproot_channel_count;
		const size = local_balance + remote_balance;
        const oracle_price = this.bitcoin_oracle_price()?.price || null;
        const size_oracle = oracle_price ? oracleConvertToUSDCents(size, oracle_price, 'msat') : null;
        const remote_oracle = oracle_price ? oracleConvertToUSDCents(remote_balance, oracle_price, 'msat') : null;
        const local_oracle = oracle_price ? oracleConvertToUSDCents(local_balance, oracle_price, 'msat') : null;
		return [
			{
				size,
				remote: remote_balance,
				local: local_balance,
				unit: 'msat',
				channel_count: sat_channel_count,
				avg_channel_size: sat_channel_count > 0 ? size / sat_channel_count : 0,
				is_bitcoin: true,
				size_oracle: size_oracle,
				remote_oracle: remote_oracle,
				local_oracle: local_oracle,
			},
		];
	}

	/**
	 * Builds channel summaries for taproot assets, grouped by asset_id
	 */
	private getTaprootAssetsSummaries(): ChannelSummary[] | null {
        const lightning_balance = this.lightning_balance();
        const taproot_assets = this.taproot_assets();  
        const enabled_taproot_assets = this.enabled_taproot_assets();
		if (!enabled_taproot_assets) return null;
		if (!lightning_balance) return null;
		if (!taproot_assets) return null;

		const grouped_summaries = lightning_balance.custom_channel_data.open_channels.reduce(
			(acc, channel) => {
				const asset_id = channel.asset_id;
				const asset = this.taproot_assets()?.assets.find((asset) => asset.asset_genesis.asset_id === asset_id);
                const decimal_display = asset ? asset.decimal_display?.decimal_display : 2;
				if (!acc[asset_id]) {
					acc[asset_id] = {
						size: 0,
						remote: 0,
						local: 0,
						unit: channel.name,
						asset_id: asset_id,
						channel_count: 0,
						avg_channel_size: 0,
                        is_bitcoin: false,
                        size_oracle: null,
                        remote_oracle: null,
                        local_oracle: null,
					};
				}
				const divisor = Math.pow(10, decimal_display);
				const size = (channel.local_balance + channel.remote_balance) / divisor;
				acc[asset_id].size += size;
				acc[asset_id].remote += channel.remote_balance / divisor;
				acc[asset_id].local += channel.local_balance / divisor;
				acc[asset_id].channel_count += 1;
				return acc;
			},
			{} as Record<string, ChannelSummary>,
		);

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
