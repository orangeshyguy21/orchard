/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {BitcoinBlock} from '@client/modules/bitcoin/classes/bitcoin-block.class';
import {BitcoinTransaction} from '@client/modules/bitcoin/classes/bitcoin-transaction.class';
import {BitcoinBlockTemplate} from '@client/modules/bitcoin/classes/bitcoin-block-template.class';
import {BitcoinTransactionFeeEstimate} from '@client/modules/bitcoin/classes/bitcoin-transaction-fee-estimate.class';
import {LightningAccount} from '@client/modules/lightning/classes/lightning-account.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';
import {OrchardError} from '@client/modules/error/types/error.types';

@Component({
	selector: 'orc-index-subsection-dashboard-bitcoin-enabled',
	standalone: false,
	templateUrl: './index-subsection-dashboard-bitcoin-enabled.component.html',
	styleUrl: './index-subsection-dashboard-bitcoin-enabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardBitcoinEnabledComponent {
	@Input() loading!: boolean;
	@Input() enabled_lightning!: boolean;
	@Input() enabled_taproot_assets!: boolean;
	@Input() blockcount!: number;
	@Input() blockchain_info!: BitcoinBlockchainInfo | null;
	@Input() block!: BitcoinBlock | null;
	@Input() block_template!: BitcoinBlockTemplate | null;
	@Input() network_info!: BitcoinNetworkInfo | null;
	@Input() mempool!: BitcoinTransaction[];
	@Input() txfee_estimate!: BitcoinTransactionFeeEstimate | null;
	@Input() lightning_accounts!: LightningAccount[];
	@Input() taproot_assets!: TaprootAssets;
	@Input() errors_lightning!: OrchardError[];
	@Input() errors_taproot_assets!: OrchardError[];
	@Input() form_group!: FormGroup;
	@Input() control_name!: string;

	@Output() target_change = new EventEmitter<number>();
}
