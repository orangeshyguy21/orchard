/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Vendor Dependencies */
import { MatTableDataSource } from '@angular/material/table';
/* Application Dependencies */
import { BitcoinBlockchainInfo } from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import { BitcoinNetworkInfo } from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import { LightningAccount } from '@client/modules/lightning/classes/lightning-account.class';
import { TaprootAssets } from '@client/modules/tapass/classes/taproot-assets.class';
import { OrchardError } from '@client/modules/error/types/error.types';

type HotCoins = {
	unit: string;
	amount: number;
	decimal_display: number;
	utxos: number;
	asset_id?: string;
}

@Component({
	selector: 'orc-index-enabled-bitcoin',
	standalone: false,
	templateUrl: './index-enabled-bitcoin.component.html',
	styleUrl: './index-enabled-bitcoin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class IndexEnabledBitcoinComponent implements OnChanges {

	@Input() loading!: boolean;
	@Input() enabled_lightning!: boolean;
	@Input() enabled_taproot_assets!: boolean;
	@Input() blockcount!: number;
	@Input() blockchain_info!: BitcoinBlockchainInfo;
	@Input() network_info!: BitcoinNetworkInfo;
	@Input() lightning_accounts!: LightningAccount[];
	@Input() taproot_assets!: TaprootAssets;
	@Input() errors_lightning!: OrchardError[];
	@Input() errors_taproot_assets!: OrchardError[];

	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();

	public displayed_columns = ['amount', 'utxos'];
	public data_source!: MatTableDataSource<HotCoins>;

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if( changes['loading'] && !this.loading ) {
			this.init();
		}
	}

	private init() : void {
		const data: HotCoins[] = [];
		const hot_coins = this.getHotBalanceBitcoin();
		const hot_coins_taproot_assets = this.getHotBalancesTaprootAssets();
		if( hot_coins ) data.push(hot_coins);
		if( hot_coins_taproot_assets.length > 0 ) data.push(...hot_coins_taproot_assets);
		this.data_source = new MatTableDataSource(data);
	}

	private getHotBalanceBitcoin(): HotCoins | null {
		if( !this.enabled_lightning ) return null;
		if( this.errors_lightning?.length > 0 ) return null;
		return {
			unit: 'sat',
			amount: this.getLightningWalletBalance(),
			decimal_display: 0,
			utxos: this.getLightningWalletUtxos()
		}
	}

	private getHotBalancesTaprootAssets(): HotCoins[] {
		if( !this.enabled_taproot_assets ) return [];
		return this.getTaprootAssetsWalletBalance();
	}

	private getLightningWalletBalance(): number {
		if( !this.enabled_lightning ) return 0;
		if( this.errors_lightning?.length > 0 ) return 0;
		return this.lightning_accounts
			.flatMap(account => account.addresses)
			.reduce((sum, address) => sum + address.balance, 0);
	}

	private getLightningWalletUtxos(): number {
		if (!this.enabled_lightning) return 0;
		if( this.errors_lightning?.length > 0 ) return 0;
		const unique_addresses = new Set(
			this.lightning_accounts
				.flatMap(account => account.addresses)
				.map(address => address.address)
		);
		return unique_addresses.size;
	}

	private getTaprootAssetsWalletBalance(): HotCoins[] {
		if (!this.enabled_taproot_assets) return [];
		if( this.errors_taproot_assets?.length > 0 ) return [];
		const grouped_assets = this.taproot_assets.assets.reduce((acc, asset) => {
			const asset_id = asset.asset_genesis.asset_id;
			const amount = parseInt(asset.amount) / Math.pow(10, asset.decimal_display?.decimal_display || 0);
			if (!acc[asset_id]) {
				acc[asset_id] = {
					unit: asset.asset_genesis.name,
					amount: 0,
					decimal_display: asset.decimal_display?.decimal_display,
					utxos: 0,
					asset_id: asset.asset_genesis.asset_id
				};
			}
			acc[asset_id].amount += amount;
			acc[asset_id].utxos++;
			return acc;
		}, {} as Record<string, HotCoins>);
		return Object.values(grouped_assets);
	}
}