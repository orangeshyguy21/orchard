/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { tap, catchError, finalize, EMPTY, forkJoin } from 'rxjs';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { BitcoinService } from '@client/modules/bitcoin/services/bitcoin.service';
import { LightningService } from '@client/modules/lightning/services/lightning/lightning.service';
import { TaprootAssetsService } from '@client/modules/tapass/services/taproot-assets.service';
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { BitcoinBlockchainInfo } from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import { BitcoinNetworkInfo } from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import { LightningInfo } from '@client/modules/lightning/classes/lightning-info.class';
import { LightningBalance } from '@client/modules/lightning/classes/lightning-balance.class';
import { LightningAccount } from '@client/modules/lightning/classes/lightning-account.class';
import { TaprootAssetInfo } from '@client/modules/tapass/classes/taproot-asset-info.class';
import { TaprootAssets } from '@client/modules/tapass/classes/taproot-assets.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';

@Component({
	selector: 'orc-index-section',
	standalone: false,
	templateUrl: './index-section.component.html',
	styleUrl: './index-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexSectionComponent implements OnInit {

	public enabled_bitcoin = environment.bitcoin.enabled;
	public enabled_lightning = environment.lightning.enabled;
	public enabled_taproot_assets = environment.taproot_assets.enabled;
	public version = environment.mode.version;
	public enabled_mint = environment.mint.enabled;
	public enabled_ecash = false;

	public loading_bitcoin:boolean = false;
	public loading_lightning:boolean = false;
	public loading_taproot_assets:boolean = false;
	public loading_mint:boolean = false;

	public error_bitcoin!: string;
	public error_lightning!: string;
	public error_taproot_assets!: string;
	public error_mint!: string;

	public bitcoin_blockchain_info!: BitcoinBlockchainInfo | null;
	public bitcoin_network_info!: BitcoinNetworkInfo | null;
	public lightning_info!: LightningInfo | null;
	public lightning_balance!: LightningBalance | null;
	public lightning_accounts!: LightningAccount[] | null;
	public taproot_assets_info!: TaprootAssetInfo | null;
	public taproot_assets!: TaprootAssets | null;
	public mint_info!: MintInfo | null;
	public mint_balances!: MintBalance[] | null;
	public mint_keysets!: MintKeyset[] | null;

	constructor(
		private bitcoinService: BitcoinService,
		private lightningService: LightningService,
		private taprootAssetsService: TaprootAssetsService,
		private mintService: MintService,
		private cdr: ChangeDetectorRef,
	) {}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.orchardOptionalInit();
	}

	private orchardOptionalInit(): void {
		if( this.enabled_bitcoin ) this.getBitcoin();
		if( this.enabled_lightning ) this.getLightning();
		if( this.enabled_taproot_assets ) this.getTaprootAssets();
		if( this.enabled_mint ) this.getMint();
	}

	/* *******************************************************
		Data                      
	******************************************************** */

	private getBitcoin(): void {
		this.loading_bitcoin = true;
		this.cdr.detectChanges();
		forkJoin({
			blockchain: this.bitcoinService.loadBitcoinBlockchainInfo(),
			network: this.bitcoinService.loadBitcoinNetworkInfo()
		}).pipe(
			tap(({ blockchain, network }) => {
				this.bitcoin_blockchain_info = blockchain;
				this.bitcoin_network_info = network;
				console.log('BLOCKCHAIN INFO', this.bitcoin_blockchain_info);
				console.log('NETWORK INFO', this.bitcoin_network_info);
				this.error_bitcoin = '';
			}),
			catchError((error) => {
				this.error_bitcoin = error.message;
				this.bitcoin_blockchain_info = null;
				this.bitcoin_network_info = null;
				return EMPTY;
			}),
			finalize(() => {
				setTimeout(() => {
					this.loading_bitcoin = false;
					this.cdr.detectChanges();
				}, 1000);
				// this.loading_bitcoin = false;
				// this.cdr.detectChanges();
			})
		).subscribe();
	}

	private getLightning(): void {
		this.loading_taproot_assets = true;
		this.cdr.detectChanges();

		forkJoin({
			info: this.lightningService.loadLightningInfo(),
			balance: this.lightningService.loadLightningBalance(),
			accounts: this.lightningService.loadLightningAccounts()
		}).pipe(
			tap(({ info, balance, accounts }) => {
				this.lightning_info = info;
				this.lightning_balance = balance;
				this.lightning_accounts = accounts;
				// console.log('LIGHTNING INFO', this.lightning_info);
				// console.log('LIGHTNING BALANCE', this.lightning_balance);
				// console.log('LIGHTNING ACCOUNTS', this.lightning_accounts);
				this.error_lightning = ''; 
			}),
			catchError((error) => {
				this.error_lightning = error instanceof Error ? error.message : 'An unknown error occurred';
				this.lightning_info = null;
				this.lightning_balance = null;
				this.lightning_accounts = null;
				return EMPTY;
			}),
			finalize(() => {
				this.loading_lightning = false;
				this.cdr.detectChanges();
			})
		).subscribe();
	}

	private getTaprootAssets(): void {
		this.loading_taproot_assets = true;
		this.cdr.detectChanges();

		forkJoin({
			info: this.taprootAssetsService.loadTaprootAssetsInfo(),
			assets: this.taprootAssetsService.loadTaprootAssets()
		}).pipe(
			tap(({ info, assets }) => {
				this.taproot_assets_info = info;
				this.taproot_assets = assets;
				console.log('TAPROOT ASSETS INFO', this.taproot_assets_info);
				console.log('TAPROOT ASSETS', this.taproot_assets);
				this.error_taproot_assets = ''; 
			}),
			catchError((error) => {
				this.error_taproot_assets = error instanceof Error ? error.message : 'An unknown error occurred';
				this.taproot_assets_info = null;
				this.taproot_assets = null;
				return EMPTY;
			}),
			finalize(() => {
				this.loading_taproot_assets = false;
				this.cdr.detectChanges();
			})
		).subscribe();
	}

	private getMint(): void {
		this.loading_mint = true;
		this.cdr.detectChanges();

		forkJoin({
			info: this.mintService.loadMintInfo(),
			balances: this.mintService.loadMintBalances(),
			keysets: this.mintService.loadMintKeysets()
		}).pipe(
			tap(({ info, balances, keysets }) => {
				this.mint_info = info;
				this.mint_balances = balances;
				this.mint_keysets = keysets;
				// console.log('MINT INFO', this.mint_info);
				// console.log('MINT BALANCES', this.mint_balances);
				// console.log('MINT KEYSETS', this.mint_keysets);
				this.error_mint = '';
			}),
			catchError((error) => {
				this.error_mint = error instanceof Error ? error.message : 'An unknown error occurred';
				this.mint_info = null;
				this.mint_balances = null;
				this.mint_keysets = null;
				return EMPTY;
			}),
			finalize(() => {
				this.loading_mint = false;
				this.cdr.detectChanges();
			})
		).subscribe();
	}
}