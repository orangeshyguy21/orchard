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
})
export class LightningGeneralChannelComponent {
	public height = input<string>('2rem');
	public size = input<number>();
	public recievable = input<number>();
	public sendable = input<number>();
	public unit = input<string>();
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

	public percentage_recievable = computed(() => {
		const recievable = this.recievable();
		const size = this.size();
		if (!recievable || !size) return 0;
		return (recievable / size) * 100;
	});

	public percentage_sendable = computed(() => {
		const sendable = this.sendable();
		const size = this.size();
		if (!sendable || !size) return 0;
		return (sendable / size) * 100;
	});

	public taproot_asset_ids: Record<string, string>;

	constructor(private configService: ConfigService) {
		this.taproot_asset_ids = this.configService.config.constants.taproot_asset_ids;
	}
}
