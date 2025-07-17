/* Core Dependencies */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Application Dependencies */
import { BitcoinBlockchainInfo } from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import { BitcoinBlock } from '@client/modules/bitcoin/classes/bitcoin-block.class';

@Component({
	selector: 'orc-index-bitcoin-syncing',
	standalone: false,
	templateUrl: './index-bitcoin-syncing.component.html',
	styleUrl: './index-bitcoin-syncing.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
		trigger('blockDataChange', [
			transition('* => *', [
				animate('200ms ease-out', style({ opacity: 0.1 })),
				animate('400ms ease-in', style({ opacity: 1 })),
			]),
		]),
    ],
})
export class IndexBitcoinSyncingComponent implements OnInit {

	@Input() blockchain_info!: BitcoinBlockchainInfo | null;
	@Input() block!: BitcoinBlock | null;

	public polling_block: boolean = false;

	public get sync_progress(): number {
		return (this.blockchain_info) ? this.blockchain_info?.verificationprogress * 100 : 0;
	}

	constructor(
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.pollingBlock();
	}

	private pollingBlock(): void {
		if( this.blockchain_info?.is_synced ) return;
		setTimeout(() => {
			this.polling_block = true;
			this.cdr.detectChanges();
		}, 1000);
	}
}