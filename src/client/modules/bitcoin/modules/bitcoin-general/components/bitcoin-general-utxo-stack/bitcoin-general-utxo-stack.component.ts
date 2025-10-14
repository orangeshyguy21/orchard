/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, computed} from '@angular/core';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';

@Component({
	selector: 'orc-bitcoin-general-utxo-stack',
	standalone: false,
	templateUrl: './bitcoin-general-utxo-stack.component.html',
	styleUrl: './bitcoin-general-utxo-stack.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinGeneralUtxoStackComponent {
	@Input() unit!: string;
	@Input() coins!: number;
	@Input() asset_id!: string | undefined;

	public limiter = 10;

	public asset_class = computed(() => {
		const lower_unit = this.unit.toLowerCase();
		if (this.asset_id === this.taproot_asset_ids['usdt']) return 'utxo-asset-tether';
		if (lower_unit === 'sat' || lower_unit === 'msat' || lower_unit === 'btc') return 'utxo-asset-btc';
		return 'utxo-asset-unknown';
	});

	public overflow_class = computed(() => {
		const lower_unit = this.unit.toLowerCase();
		if (this.asset_id === this.taproot_asset_ids['usdt']) return 'utxo-overflow-tether';
		if (lower_unit === 'sat' || lower_unit === 'msat' || lower_unit === 'btc') return 'utxo-overflow-btc';
		return 'utxo-overflow-unknown';
	});

	public coin_array = computed(() => {
		const count = Math.min(this.coins - 1, this.limiter - 1);
		return Array.from({length: count}, (_, i) => i);
	});

	private taproot_asset_ids: Record<string, string>;

	constructor(private configService: ConfigService) {
		this.taproot_asset_ids = this.configService.config.constants.taproot_asset_ids;
	}
}
