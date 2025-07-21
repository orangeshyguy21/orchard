/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, computed} from '@angular/core';
/* Application Configuration */
import {environment} from '@client/configs/configuration';

@Component({
	selector: 'orc-lightning-channel',
	standalone: false,
	templateUrl: './lightning-channel.component.html',
	styleUrl: './lightning-channel.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightningChannelComponent {
	@Input() height: string = '2rem';
	@Input() size!: number;
	@Input() recievable!: number;
	@Input() sendable!: number;
	@Input() unit!: string;
	@Input() asset_id?: string;

	public lower_unit = computed(() => {
		return this.unit.toLowerCase();
	});

	public channel_class = computed(() => {
		if (this.lower_unit() === 'sat') return 'channel-btc';
		if (this.lower_unit() === 'msat') return 'channel-btc';
		if (this.lower_unit() === 'btc') return 'channel-btc';
		if (this.asset_id === environment.constants.taproot_asset_ids.usdt) return 'channel-tether';
		return 'channel-unknown';
	});

	public percentage_recievable = computed(() => {
		return (this.recievable / this.size) * 100;
	});

	public percentage_sendable = computed(() => {
		return (this.sendable / this.size) * 100;
	});
}
