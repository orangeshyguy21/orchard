/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy, signal} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormControl} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/* Vendor Dependencies */
import {tap, catchError, finalize, EMPTY, forkJoin, Subscription, firstValueFrom, timer, switchMap, takeWhile} from 'rxjs';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {SettingAppService} from '@client/modules/settings/services/setting-app/setting-app.service';
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import {LightningService} from '@client/modules/lightning/services/lightning/lightning.service';
import {TaprootAssetsService} from '@client/modules/tapass/services/taproot-assets.service';
import {MintService} from '@client/modules/mint/services/mint/mint.service';
import {PublicService} from '@client/modules/public/services/image/public.service';
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {BitcoinBlockCount} from '@client/modules/bitcoin/classes/bitcoin-blockcount.class';
import {BitcoinBlock} from '@client/modules/bitcoin/classes/bitcoin-block.class';
import {BitcoinTransaction} from '@client/modules/bitcoin/classes/bitcoin-transaction.class';
import {BitcoinBlockTemplate} from '@client/modules/bitcoin/classes/bitcoin-block-template.class';
import {BitcoinTransactionFeeEstimate} from '@client/modules/bitcoin/classes/bitcoin-transaction-fee-estimate.class';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {LightningAccount} from '@client/modules/lightning/classes/lightning-account.class';
import {TaprootAssetInfo} from '@client/modules/tapass/classes/taproot-asset-info.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {OrchardError} from '@client/modules/error/types/error.types';
import {DeviceType} from '@client/modules/layout/types/device.types';

@Component({
	selector: 'orc-index-subsection-dashboard',
	standalone: false,
	templateUrl: './index-subsection-dashboard.component.html',
	styleUrl: './index-subsection-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardComponent implements OnInit, OnDestroy {
	public enabled_bitcoin: boolean;
	public enabled_bitcoin_oracle: boolean;
	public enabled_lightning: boolean;
	public enabled_taproot_assets: boolean;
	public version: string;
	public enabled_mint: boolean;
	public enabled_ecash = false;
	public device_type = signal<DeviceType>('desktop');
	public bitcoin_oracle_price = signal<BitcoinOraclePrice | null>(null);

	public loading_bitcoin: boolean = true;
	public loading_lightning: boolean = true;
	public loading_taproot_assets: boolean = true;
	public loading_mint: boolean = true;
	public loading_mint_icon: boolean = true;

	public errors_bitcoin: OrchardError[] = [];
	public errors_lightning: OrchardError[] = [];
	public errors_taproot_assets: OrchardError[] = [];
	public errors_mint: OrchardError[] = [];

	public bitcoin_blockchain_info!: BitcoinBlockchainInfo | null;
	public bitcoin_network_info!: BitcoinNetworkInfo | null;
	public bitcoin_blockcount!: BitcoinBlockCount | null;
	public bitcoin_block!: BitcoinBlock | null;
	public bitcoin_mempool!: BitcoinTransaction[] | null;
	public bitcoin_block_template!: BitcoinBlockTemplate | null;
	public bitcoin_txfee_estimate!: BitcoinTransactionFeeEstimate | null;
	public lightning_info!: LightningInfo | null;
	public lightning_balance!: LightningBalance | null;
	public lightning_accounts!: LightningAccount[] | null;
	public taproot_assets_info!: TaprootAssetInfo | null;
	public taproot_assets!: TaprootAssets | null;
	public mint_info!: MintInfo | null;
	public mint_balances!: MintBalance[] | null;
	public mint_keysets!: MintKeyset[] | null;
	public mint_icon_data!: string | null;

	public bitcoin_txfee_form: FormGroup = new FormGroup({
		target: new FormControl(1),
	});

	public get preparing_bitcoin(): boolean {
		return this.loading_bitcoin || this.loading_lightning || this.loading_taproot_assets || this.errors_bitcoin.length > 0;
	}
	public get preparing_lightning(): boolean {
		return (
			this.loading_lightning ||
			this.loading_taproot_assets ||
			this.errors_lightning.length > 0 ||
			this.errors_taproot_assets.length > 0
		);
	}
	public get preparing_mint(): boolean {
		return this.loading_mint || this.errors_mint.length > 0;
	}

	private subscriptions: Subscription = new Subscription();
	private bitcoin_polling_active: boolean = false;

	constructor(
		private configService: ConfigService,
		private settingAppService: SettingAppService,
		private bitcoinService: BitcoinService,
		private lightningService: LightningService,
		private taprootAssetsService: TaprootAssetsService,
		private mintService: MintService,
		private publicService: PublicService,
		private breakpointObserver: BreakpointObserver,
		private router: Router,
		private cdr: ChangeDetectorRef,
	) {
		this.enabled_bitcoin = this.configService.config.bitcoin.enabled;
		this.enabled_bitcoin_oracle = this.settingAppService.getSetting('bitcoin_oracle');
		this.enabled_lightning = this.configService.config.lightning.enabled;
		this.enabled_taproot_assets = this.configService.config.taproot_assets.enabled;
		this.version = this.configService.config.mode.version;
		this.enabled_mint = this.configService.config.mint.enabled;
	}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.orchardOptionalInit();
		this.subscriptions.add(this.getBreakpointSubscription());
	}

	private orchardOptionalInit(): void {
		this.initBitcoin();
		this.initLightning();
		this.initTaprootAssets();
		this.initMint();
	}
	private initBitcoin(): void {
		this.loading_bitcoin = this.enabled_bitcoin ? true : false;
		if (this.enabled_bitcoin) {
			this.getBitcoin();
			this.subscriptions.add(this.getBitcoinBlockSubscription());
		}
		if (this.enabled_bitcoin_oracle) {
			this.subscriptions.add(this.getBitcoinOraclePriceSubscription());
		}
		this.cdr.detectChanges();
	}
	private initLightning(): void {
		this.loading_lightning = this.enabled_lightning ? true : false;
		if (this.enabled_lightning) this.getLightning();
		this.cdr.detectChanges();
	}
	private initTaprootAssets(): void {
		this.loading_taproot_assets = this.enabled_taproot_assets ? true : false;
		if (this.enabled_taproot_assets) this.getTaprootAssets();
		this.cdr.detectChanges();
	}
	private initMint(): void {
		this.loading_mint = this.enabled_mint ? true : false;
		this.loading_mint_icon = this.enabled_mint ? true : false;
		if (this.enabled_mint) this.getMint();
		this.cdr.detectChanges();
	}

	/* *******************************************************
		Subscriptions                      
	******************************************************** */

	private getBitcoinBlockSubscription(): Subscription {
		return this.bitcoinService.bitcoin_blockcount$.subscribe((blockcount: BitcoinBlockCount | null) => {
			if (!blockcount) return;
			if (this.bitcoin_blockcount && blockcount.height > this.bitcoin_blockcount?.height) this.refreshBitcoinMempool();
			this.bitcoin_blockcount = blockcount;
			this.cdr.detectChanges();
		});
	}

	private getBitcoinBlockchainSubscription(): Subscription {
		this.bitcoin_polling_active = true;
		this.loading_bitcoin = false;
		this.cdr.detectChanges();
		return timer(0, 5000)
			.pipe(
				takeWhile(() => this.bitcoin_polling_active),
				switchMap(() =>
					this.bitcoinService.getBitcoinBlockchainInfo().pipe(
						catchError((error) => {
							console.error('Failed to fetch blockchain info, polling stopped:', error);
							this.bitcoin_polling_active = false;
							return EMPTY;
						}),
					),
				),
			)
			.subscribe({
				next: async (blockchain_info: BitcoinBlockchainInfo) => {
					this.bitcoin_blockchain_info = blockchain_info;
					this.getBitcoinBlock();
					this.cdr.detectChanges();
				},
			});
	}

	private getBitcoinOraclePriceSubscription(): Subscription {
		return this.bitcoinService.loadBitcoinOraclePrice().subscribe((price) => {
			this.bitcoin_oracle_price.set(price);
		});
	}

	public getBreakpointSubscription(): Subscription {
		return this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]).subscribe((result) => {
			if (result.breakpoints[Breakpoints.XSmall]) {
				this.device_type.set('mobile');
			} else if (result.breakpoints[Breakpoints.Small] || result.breakpoints[Breakpoints.Medium]) {
				this.device_type.set('tablet');
			} else {
				this.device_type.set('desktop');
			}
		});
	}

	/* *******************************************************
		Data                      
	******************************************************** */

	private getBitcoin(): void {
		forkJoin({
			blockchain: this.bitcoinService.loadBitcoinBlockchainInfo(),
			network: this.bitcoinService.loadBitcoinNetworkInfo(),
		})
			.pipe(
				tap(({blockchain, network}) => {
					this.bitcoin_blockchain_info = blockchain;
					this.bitcoin_network_info = network;
				}),
				catchError((error) => {
					this.errors_bitcoin = error.errors;
					this.cdr.detectChanges();
					return EMPTY;
				}),
				finalize(() => {
					!this.bitcoin_blockchain_info?.is_synced
						? this.subscriptions.add(this.getBitcoinBlockchainSubscription())
						: this.getBitcoinMempool();
					this.cdr.detectChanges();
				}),
			)
			.subscribe();
	}

	private getBitcoinMempool(): void {
		forkJoin({
			block: this.bitcoinService.getBlock(this.bitcoin_blockchain_info?.bestblockhash ?? ''),
			block_template: this.bitcoinService.getBitcoinBlockTemplate(),
			mempool: this.bitcoinService.getBitcoinMempoolTransactions(),
			txfee: this.bitcoinService.getBitcoinTransactionFeeEstimates([this.bitcoin_txfee_form.value.target]),
		})
			.pipe(
				tap(({block, block_template, mempool, txfee}) => {
					this.bitcoin_block = block;
					this.bitcoin_block_template = block_template;
					this.bitcoin_mempool = mempool;
					this.bitcoin_txfee_estimate = txfee[0] ?? null;
				}),
				catchError((error) => {
					this.errors_bitcoin = error.errors;
					this.cdr.detectChanges();
					return EMPTY;
				}),
				finalize(() => {
					this.loading_bitcoin = false;
					this.cdr.detectChanges();
				}),
			)
			.subscribe();
	}

	private refreshBitcoinMempool(): void {
		this.bitcoinService.getBitcoinBlockchainInfo().subscribe((blockchain_info: BitcoinBlockchainInfo) => {
			this.bitcoin_blockchain_info = blockchain_info;
			this.getBitcoinMempool();
		});
	}

	private getBitcoinBlock(): void {
		this.bitcoinService.getBlock(this.bitcoin_blockchain_info?.bestblockhash ?? '').subscribe((block) => {
			this.bitcoin_block = block;
			this.cdr.detectChanges();
		});
	}

	private getBitcoinFeeEstimate(): void {
		this.bitcoinService.getBitcoinTransactionFeeEstimates([this.bitcoin_txfee_form.value.target]).subscribe((txfee) => {
			this.bitcoin_txfee_estimate = txfee[0] ?? null;
			this.cdr.detectChanges();
		});
	}

	private getLightning(): void {
		forkJoin({
			info: this.lightningService.loadLightningInfo(),
			balance: this.lightningService.loadLightningBalance(),
			accounts: this.lightningService.loadLightningAccounts(),
		})
			.pipe(
				tap(({info, balance, accounts}) => {
					this.lightning_info = info;
					this.lightning_balance = balance;
					this.lightning_accounts = accounts;
				}),
				catchError((error) => {
					this.errors_lightning = error.errors;
					this.cdr.detectChanges();
					return EMPTY;
				}),
				finalize(() => {
					this.loading_lightning = false;
					this.cdr.detectChanges();
				}),
			)
			.subscribe();
	}

	private getTaprootAssets(): void {
		forkJoin({
			info: this.taprootAssetsService.loadTaprootAssetsInfo(),
			assets: this.taprootAssetsService.loadTaprootAssets(),
		})
			.pipe(
				tap(({info, assets}) => {
					this.taproot_assets_info = info;
					this.taproot_assets = assets;
				}),
				catchError((error) => {
					this.errors_taproot_assets = error.errors;
					this.cdr.detectChanges();
					return EMPTY;
				}),
				finalize(() => {
					this.loading_taproot_assets = false;
					this.cdr.detectChanges();
				}),
			)
			.subscribe();
	}

	private getMint(): void {
		forkJoin({
			info: this.mintService.loadMintInfo(),
			balances: this.mintService.loadMintBalances(),
			keysets: this.mintService.loadMintKeysets(),
		})
			.pipe(
				tap(({info, balances, keysets}) => {
					this.mint_info = info;
					this.mint_balances = balances;
					this.mint_keysets = keysets;
				}),
				catchError((error) => {
					this.errors_mint = error.errors;
					this.cdr.detectChanges();
					return EMPTY;
				}),
				finalize(async () => {
					this.loading_mint = false;
					if (this.mint_info?.icon_url) {
						const image = await firstValueFrom(this.publicService.getPublicImageData(this.mint_info?.icon_url));
						this.mint_icon_data = image?.data ?? null;
					}
					this.loading_mint_icon = false;
					this.cdr.detectChanges();
				}),
			)
			.subscribe();
	}

	/* *******************************************************
		Actions Up                      
	******************************************************** */

	public onNavigate(route: string): void {
		this.router.navigate([`/${route}`]);
	}

	public onTargetChange(): void {
		this.getBitcoinFeeEstimate();
	}

	/* *******************************************************
		Destroy                    
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
