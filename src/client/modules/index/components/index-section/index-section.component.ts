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
import { TaprootAssetInfo } from '@client/modules/tapass/classes/taproot-asset-info.class';
import { TaprootAssets } from '@client/modules/tapass/classes/taproot-assets.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';

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
	public taproot_assets_info!: TaprootAssetInfo | null;
	public taproot_assets!: TaprootAssets | null;
	public mint_info!: MintInfo | null;

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
				this.error_bitcoin = '';
			}),
			catchError((error) => {
				this.error_bitcoin = error.message;
				this.bitcoin_blockchain_info = null;
				this.bitcoin_network_info = null;
				return EMPTY;
			}),
			finalize(() => {
				this.loading_bitcoin = false;
				this.cdr.detectChanges();
			})
		).subscribe();
	}

	private getLightning(): void {
		this.loading_taproot_assets = true;
		this.cdr.detectChanges();

		forkJoin({
			info: this.lightningService.loadLightningInfo(),
			balance: this.lightningService.loadLightningBalance()
		}).pipe(
			tap(({ info, balance }) => {
				this.lightning_info = info;
				this.lightning_balance = balance;
				this.error_lightning = ''; 
			}),
			catchError((error) => {
				this.error_lightning = error instanceof Error ? error.message : 'An unknown error occurred';
				this.lightning_info = null;
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

		this.mintService.loadMintInfo().pipe(
			tap((info: MintInfo) => {
				this.mint_info = info;
				this.error_mint = '';
			}),
			catchError((error) => {
				this.error_mint = error instanceof Error ? error.message : 'An unknown error occurred';
				this.mint_info = null;
				return EMPTY;
			}),
			finalize(() => {
				this.loading_mint = false;
				this.cdr.detectChanges();
			})
		).subscribe();
	}
}