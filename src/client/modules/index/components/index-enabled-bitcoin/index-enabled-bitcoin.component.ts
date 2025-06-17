/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Application Dependencies */
import { BitcoinBlockchainInfo } from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import { BitcoinNetworkInfo } from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import { LightningAccount } from '@client/modules/lightning/classes/lightning-account.class';
import { TaprootAssets } from '@client/modules/tapass/classes/taproot-assets.class';

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

	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();

	public balances_hot!: HotCoins[] | null;

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if( changes['loading'] && !this.loading ) {
			this.init();
		}
	}

	private init() : void {
		this.balances_hot = this.getHotBalances();
	}

	private getHotBalances(): HotCoins[] | null {
		if( !this.enabled_lightning && !this.enabled_taproot_assets ) return null;
		const lightning_wallet = {
			unit: 'sat',
			amount: this.getLightningWalletBalance(),
			decimal_display: 0,
			utxos: this.getLightningWalletUtxos()
		}
		const taproot_assets_wallet = this.getTaprootAssetsWalletBalance();
		return ( taproot_assets_wallet ) ? [lightning_wallet, ...taproot_assets_wallet] : [lightning_wallet];
	}

	private getLightningWalletBalance(): number {
		if( !this.enabled_lightning ) return 0;
		return this.lightning_accounts
			.flatMap(account => account.addresses)
			.reduce((sum, address) => sum + address.balance, 0);
	}

	private getLightningWalletUtxos(): number {
		if (!this.enabled_lightning) return 0;
		const unique_addresses = new Set(
			this.lightning_accounts
				.flatMap(account => account.addresses)
				.map(address => address.address)
		);
		return unique_addresses.size;
	}

	private getTaprootAssetsWalletBalance(): HotCoins[] | null {
		if (!this.enabled_taproot_assets) return null;
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