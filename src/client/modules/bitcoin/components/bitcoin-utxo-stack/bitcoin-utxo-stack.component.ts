import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';

@Component({
	selector: 'orc-bitcoin-utxo-stack',
	standalone: false,
	templateUrl: './bitcoin-utxo-stack.component.html',
	styleUrl: './bitcoin-utxo-stack.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BitcoinUtxoStackComponent {

	@Input() unit!: string;
	@Input() coins!: number;
	@Input() asset_id!: string | undefined;

	public limiter = 10;

	public asset_class = computed(() => {
		const lower_unit = this.unit.toLowerCase();
		if( this.asset_id === 'f81dce34c31687b969e1c5acc69ad6bb04528bd1d593efdc2d505245051f1648' ) return 'utxo-asset-tether';
		if( lower_unit === 'sat' || lower_unit === 'msat' || lower_unit === 'btc' ) return 'utxo-asset-btc';
		return 'utxo-asset-unknown';
	});

	public overflow_class = computed(() => {
		const lower_unit = this.unit.toLowerCase();
		if( this.asset_id === 'f81dce34c31687b969e1c5acc69ad6bb04528bd1d593efdc2d505245051f1648' ) return 'utxo-overflow-tether';
		if( lower_unit === 'sat' || lower_unit === 'msat' || lower_unit === 'btc' ) return 'utxo-overflow-btc';
		return 'utxo-overflow-unknown';
	});

	public coin_array = computed(() => {
		return Array.from({ length: (this.coins - 1) }).slice( 0, this.limiter-1 );
	});

}