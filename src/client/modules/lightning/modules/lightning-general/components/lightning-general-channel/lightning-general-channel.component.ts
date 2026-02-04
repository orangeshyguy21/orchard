/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';

@Component({
	selector: 'orc-lightning-general-channel',
	standalone: false,
	templateUrl: './lightning-general-channel.component.html',
	styleUrl: './lightning-general-channel.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style.--ring-size]': 'size()',
	},
})
export class LightningGeneralChannelComponent {
	public size = input<string>('4rem');
	public capacity = input.required<number>();
	public remote = input.required<number>();
	public local = input.required<number>();
	public unit = input.required<string>();
	public asset_id = input<string>();

	public lower_unit = computed(() => {
		return this.unit()?.toLowerCase();
	});

	public channel_class = computed(() => {
		if (this.lower_unit() === 'sat') return 'channel-btc';
		if (this.lower_unit() === 'msat') return 'channel-btc';
		if (this.lower_unit() === 'btc') return 'channel-btc';
		if (this.asset_id() === this.taproot_asset_ids['usdt']) return 'channel-tether';
		return 'channel-unknown';
	});

	public percentage_remote = computed(() => {
		const remote = this.remote();
		const capacity = this.capacity();
		if (!remote || !capacity) return 0;
		return (remote / capacity) * 100;
	});

	public percentage_local = computed(() => {
		const local = this.local();
		const capacity = this.capacity();
		if (!local || !capacity) return 0;
		return (local / capacity) * 100;
	});

	public taproot_asset_ids: Record<string, string>;

	constructor(private configService: ConfigService) {
		this.taproot_asset_ids = this.configService.config.constants.taproot_asset_ids;
	}
}
