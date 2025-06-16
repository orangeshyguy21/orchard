/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';

@Component({
	selector: 'orc-lightning-channel',
	standalone: false,
	templateUrl: './lightning-channel.component.html',
	styleUrl: './lightning-channel.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightningChannelComponent {

	@Input() height: string = '2rem';
	@Input() size!: number;
	@Input() fill!: number;
	@Input() unit!: string;
	@Input() asset_id?: string;

	
	// public unit_icon = computed(() => {
	// 	if( this.lower_unit() === 'sat' ) return 'currency_bitcoin';
	// 	if( this.lower_unit() === 'msat' ) return 'currency_bitcoin';
	// 	if( this.lower_unit() === 'btc' ) return 'currency_bitcoin';
	// 	if( this.lower_unit() === 'usd' ) return 'attach_money';
	// 	if( this.lower_unit() === 'eur' ) return 'euro';
	// 	return 'question_mark';
	// });

	public fill_percentage = computed(() => {
		return (this.fill / this.size) * 100;
	});
}