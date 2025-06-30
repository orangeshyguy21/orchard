/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
/* Vendor Dependencies */
import { tap, catchError, finalize, EMPTY, forkJoin, Subscription, firstValueFrom, timer, switchMap } from 'rxjs';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { BitcoinService } from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import { LightningService } from '@client/modules/lightning/services/lightning/lightning.service';
import { TaprootAssetsService } from '@client/modules/tapass/services/taproot-assets.service';
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { PublicService } from '@client/modules/public/services/image/public.service';
import { BitcoinBlockchainInfo } from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import { BitcoinNetworkInfo } from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import { BitcoinBlockCount } from '@client/modules/bitcoin/classes/bitcoin-blockcount.class';
import { BitcoinBlock } from '@client/modules/bitcoin/classes/bitcoin-block.class';
import { LightningInfo } from '@client/modules/lightning/classes/lightning-info.class';
import { LightningBalance } from '@client/modules/lightning/classes/lightning-balance.class';
import { LightningAccount } from '@client/modules/lightning/classes/lightning-account.class';
import { TaprootAssetInfo } from '@client/modules/tapass/classes/taproot-asset-info.class';
import { TaprootAssets } from '@client/modules/tapass/classes/taproot-assets.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { OrchardError } from '@client/modules/error/types/error.types';

@Component({
	selector: 'orc-index-section',
	standalone: false,
	templateUrl: './index-section.component.html',
	styleUrl: './index-section.component.scss',
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
export class IndexSectionComponent implements OnInit, OnDestroy {

	public enabled_bitcoin = environment.bitcoin.enabled;
	public enabled_lightning = environment.lightning.enabled;
	public enabled_taproot_assets = environment.taproot_assets.enabled;
	public version = environment.mode.version;
	public enabled_mint = environment.mint.enabled;
	public enabled_ecash = false;

	public loading_bitcoin:boolean = true;
	public loading_lightning:boolean = true;
	public loading_taproot_assets:boolean = true;
	public loading_mint:boolean = true;

	public errors_bitcoin: OrchardError[] = [];
	public errors_lightning: OrchardError[] = [];
	public errors_taproot_assets: OrchardError[] = [];
	public errors_mint: OrchardError[] = [];

	public bitcoin_blockchain_info!: BitcoinBlockchainInfo | null;
	public bitcoin_network_info!: BitcoinNetworkInfo | null;
	public bitcoin_blockcount!: BitcoinBlockCount | null;
	public bitcoin_block!: BitcoinBlock | null;
	public lightning_info!: LightningInfo | null;
	public lightning_balance!: LightningBalance | null;
	public lightning_accounts!: LightningAccount[] | null;
	public taproot_assets_info!: TaprootAssetInfo | null;
	public taproot_assets!: TaprootAssets | null;
	public mint_info!: MintInfo | null;
	public mint_balances!: MintBalance[] | null;
	public mint_keysets!: MintKeyset[] | null;
	public mint_icon_data!: string | null;

	public get preparing_bitcoin(): boolean {
		return this.loading_bitcoin || this.loading_lightning || this.loading_taproot_assets || this.errors_bitcoin.length > 0;
	}
	public get preparing_lightning(): boolean {
		return this.loading_lightning || this.loading_taproot_assets || this.errors_lightning.length > 0 || this.errors_taproot_assets.length > 0;
	}
	public get preparing_mint(): boolean {
		return this.loading_mint || this.errors_mint.length > 0;
	}

	private subscriptions: Subscription = new Subscription();

	constructor(
		private bitcoinService: BitcoinService,
		private lightningService: LightningService,
		private taprootAssetsService: TaprootAssetsService,
		private mintService: MintService,
		private publicService: PublicService,
		private router: Router,
		private cdr: ChangeDetectorRef,
	) {}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.orchardOptionalInit();
	}

	private orchardOptionalInit(): void {
		this.initBitcoin();
		this.initLightning();
		this.initTaprootAssets();
		this.initMint();
	}
	private initBitcoin(): void {
		this.loading_bitcoin = ( this.enabled_bitcoin ) ? true : false;
		if( this.enabled_bitcoin ) {
			this.getBitcoin();
			this.subscriptions.add(this.getBitcoinBlockSubscription());
		} 
		this.cdr.detectChanges();
	}
	private initLightning(): void {
		this.loading_lightning = ( this.enabled_lightning ) ? true : false;
		if( this.enabled_lightning ) this.getLightning();
		this.cdr.detectChanges();
	}
	private initTaprootAssets(): void {
		this.loading_taproot_assets = ( this.enabled_taproot_assets ) ? true : false;
		if( this.enabled_taproot_assets ) this.getTaprootAssets();
		this.cdr.detectChanges();
	}
	private initMint(): void {
		this.loading_mint = ( this.enabled_mint ) ? true : false;
		if( this.enabled_mint ) this.getMint();
		this.cdr.detectChanges();
	}

	/* *******************************************************
		Data                      
	******************************************************** */

	private getBitcoin(): void {
		forkJoin({
			blockchain: this.bitcoinService.loadBitcoinBlockchainInfo(),
			network: this.bitcoinService.loadBitcoinNetworkInfo()
		}).pipe(
			tap(({ blockchain, network }) => {
				this.bitcoin_blockchain_info = blockchain;
				this.bitcoin_network_info = network;
			}),
			catchError((error) => {
				this.errors_bitcoin = error.errors;
				this.cdr.detectChanges();
				return EMPTY;
			}),
			finalize(() => {
				this.loading_bitcoin = false;
				if( this.bitcoin_blockchain_info?.initialblockdownload ) this.subscriptions.add(this.getBitcoinBlockchainSubscription());
				this.cdr.detectChanges();
			})
		).subscribe();
	}

	private getBitcoinBlockSubscription(): Subscription {
		return this.bitcoinService.bitcoin_blockcount$.subscribe(
            (blockcount:BitcoinBlockCount | null) => {
				if( !blockcount ) return;
				this.bitcoin_blockcount = blockcount;
				this.cdr.detectChanges();
            }
        );
	}

	private getBitcoinBlockchainSubscription(): Subscription {
		return timer(0, 10000).pipe(
			switchMap(() => this.bitcoinService.getBitcoinBlockchainInfo().pipe(
				catchError(error => {
					console.error('Failed to fetch block count, polling stopped:', error);
					return EMPTY;
				})
			))
		).subscribe({
			next: async (blockchain_info: BitcoinBlockchainInfo) => {
				this.bitcoin_blockchain_info = blockchain_info;
				this.getBitcoinBlock();
				this.cdr.detectChanges();
			}
		});
	}

	private getBitcoinBlock(): void {
		this.bitcoinService.getBlock(this.bitcoin_blockchain_info?.bestblockhash ?? '').subscribe((block) => {
			this.bitcoin_block = block;
			this.cdr.detectChanges();
		});
	}

	private getLightning(): void {
		forkJoin({
			info: this.lightningService.loadLightningInfo(),
			balance: this.lightningService.loadLightningBalance(),
			accounts: this.lightningService.loadLightningAccounts()
		}).pipe(
			tap(({ info, balance, accounts }) => {
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
			})
		).subscribe();
	}

	private getTaprootAssets(): void {
		forkJoin({
			info: this.taprootAssetsService.loadTaprootAssetsInfo(),
			assets: this.taprootAssetsService.loadTaprootAssets()
		}).pipe(
			tap(({ info, assets }) => {
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
			})
		).subscribe();
	}

	private getMint(): void {
		forkJoin({
			info: this.mintService.loadMintInfo(),
			balances: this.mintService.loadMintBalances(),
			keysets: this.mintService.loadMintKeysets()
		}).pipe(
			tap(({ info, balances, keysets }) => {
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
				if( this.mint_info?.icon_url ){
					const image = await firstValueFrom(this.publicService.getPublicImageData(this.mint_info?.icon_url));
					this.mint_icon_data = image?.data ?? null;
				}
				this.loading_mint = false;
				this.cdr.detectChanges();
			})
		).subscribe();
	}

	/* *******************************************************
		Actions Up                      
	******************************************************** */

	public onNavigate(route: string): void {
		this.router.navigate([`/${route}`]);
	}

	/* *******************************************************
		Destroy                    
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}