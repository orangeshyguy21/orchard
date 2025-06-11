/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
/* Vendor Dependencies */
import { Subscription} from 'rxjs';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { BitcoinService } from '@client/modules/bitcoin/services/bitcoin.service';
import { LightningService } from '@client/modules/lightning/services/lightning/lightning.service';
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { BitcoinInfo } from '@client/modules/bitcoin/classes/bitcoin-info.class';
import { LightningInfo } from '@client/modules/lightning/classes/lightning-info.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';

@Component({
	selector: 'orc-index-section',
	standalone: false,
	templateUrl: './index-section.component.html',
	styleUrl: './index-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexSectionComponent implements OnInit, OnDestroy {

	private subscriptions: Subscription = new Subscription();

	constructor(
		private bitcoinService: BitcoinService,
		private lightningService: LightningService,
		private mintService: MintService,
	) {}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.orchardOptionalInit();
	}

	private orchardOptionalInit(): void {
		if( environment.bitcoin.enabled ) {
			this.bitcoinService.loadBitcoinInfo().subscribe();
			this.subscriptions.add(this.getBitcoinInfoSubscription());
		}
		if( environment.lightning.enabled ) {
			this.lightningService.loadLightningInfo().subscribe();
			this.subscriptions.add(this.getLightningInfoSubscription());
		}
		if( environment.mint.enabled ) {
			this.mintService.loadMintInfo().subscribe();
			this.subscriptions.add(this.getMintInfoSubscription());
		}
	}

	/* *******************************************************
		Subscriptions                      
	******************************************************** */

	private getBitcoinInfoSubscription(): Subscription {
		return this.bitcoinService.bitcoin_info$.subscribe({
			next: (info: BitcoinInfo | null) => {
				// this.chain = info?.chain || '';
				// this.online_bitcoin = (info !== null) ? true : false;
				// this.cdr.detectChanges();
			},
			error: (error) => {
				// this.online_bitcoin = false;
				// this.cdr.detectChanges();
			}
		});
	}

	private getLightningInfoSubscription(): Subscription {
		return this.lightningService.lightning_info$.subscribe({
			next: (info: LightningInfo | null) => {
				// this.online_lightning = (info !== null) ? true : false;
				// this.cdr.detectChanges();
			},
			error: (error) => {
				// this.online_lightning = false;
				// this.cdr.detectChanges();
			}
		});
	}

	private getMintInfoSubscription(): Subscription {	
		return this.mintService.mint_info$.subscribe({
			next: (info: MintInfo | null) => {
				// this.online_mint = (info !== null) ? true : false;
				// this.cdr.detectChanges();
			},
			error: (error) => {
				// this.online_mint = false;
				// this.cdr.detectChanges();
			}
		});
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}