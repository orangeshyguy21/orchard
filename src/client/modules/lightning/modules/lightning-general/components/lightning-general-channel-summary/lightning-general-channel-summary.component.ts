/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
/* Application Dependencies */
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';

type ChannelSummary = {
	size: number;
	remote: number;
	local: number;
	decimal_display: number;
	unit: string;
	asset_id?: string;
};

@Component({
	selector: 'orc-lightning-general-channel-summary',
	standalone: false,
	templateUrl: './lightning-general-channel-summary.component.html',
	styleUrl: './lightning-general-channel-summary.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightningGeneralChannelSummaryComponent implements OnInit {
	public enabled_taproot_assets = input.required<boolean>();
	public lightning_balance = input.required<LightningBalance | null>();
	public taproot_assets = input.required<TaprootAssets | null>();

	public displayed_columns = ['unit', 'receive', 'channel', 'send'];
	public rows = signal<ChannelSummary[]>([]);
    public expanded = signal<Record<string, boolean>>({});

	ngOnInit(): void {
		this.init();
	}

	private init(): void {
		const sat_summary = this.getSatSummary();
		const taproot_assets_summaries = this.getTaprootAssetsSummaries();
		const data = taproot_assets_summaries ? [...sat_summary, ...taproot_assets_summaries] : [...sat_summary];
		this.rows.set(data);
	}

	private getSatSummary(): ChannelSummary[] {
		const local_balance = this.lightning_balance()?.local_balance || 0;
		const remote_balance = this.lightning_balance()?.remote_balance || 0;
		if (local_balance === 0 && remote_balance === 0) return [];
		return [
			{
				size: local_balance + remote_balance,
				remote: remote_balance,
				local: local_balance,
				unit: 'msat',
				decimal_display: 0,
			},
		];
	}

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
				if (!acc[asset_id]) {
					acc[asset_id] = {
						size: 0,
						remote: 0,
						local: 0,
						unit: channel.name,
						decimal_display: asset ? asset.decimal_display?.decimal_display : 0,
						asset_id: asset_id,
					};
				}
				const size = (channel.local_balance + channel.remote_balance) / Math.pow(10, acc[asset_id].decimal_display);
				acc[asset_id].size += size;
				acc[asset_id].remote += channel.remote_balance / Math.pow(10, acc[asset_id].decimal_display);
				acc[asset_id].local += channel.local_balance / Math.pow(10, acc[asset_id].decimal_display);
				return acc;
			},
			{} as Record<string, ChannelSummary>,
		);

		return Object.values(grouped_summaries);
	}

    /** Toggles the expanded state for a given unit row */
	public toggleExpanded(unit: string): void {
		this.expanded.update((state) => ({...state, [unit]: !state[unit]}));
	}
}
