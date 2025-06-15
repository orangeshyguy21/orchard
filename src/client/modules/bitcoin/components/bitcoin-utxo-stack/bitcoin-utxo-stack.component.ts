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

	public limiter = 10;

	public asset_class = computed(() => {
		const lower_unit = this.unit.toLowerCase();
		if( lower_unit === 'sat' ) return 'utxo-asset-btc';
		if( lower_unit === 'msat' ) return 'utxo-asset-btc';
		if( lower_unit === 'btc' ) return 'utxo-asset-btc';
		if( lower_unit === 'usd' ) return 'utxo-asset-usd';
		if( lower_unit === 'eur' ) return 'utxo-asset-eur';
		return 'utxo-asset-unknown';
	});

	public overflow_class = computed(() => {
		const lower_unit = this.unit.toLowerCase();
		if( lower_unit === 'sat' ) return 'utxo-overflow-btc';
		if( lower_unit === 'msat' ) return 'utxo-overflow-btc';
		if( lower_unit === 'btc' ) return 'utxo-overflow-btc';
		if( lower_unit === 'usd' ) return 'utxo-overflow-usd';
		if( lower_unit === 'eur' ) return 'utxo-overflow-eur';
		return 'utxo-overflow-unknown';
	});

	public coin_array = computed(() => {
		return Array.from({ length: (this.coins - 1) }).slice( 0, this.limiter-1 );
	});

}