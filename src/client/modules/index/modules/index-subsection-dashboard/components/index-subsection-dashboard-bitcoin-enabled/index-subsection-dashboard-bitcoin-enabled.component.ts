/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {BitcoinBlock} from '@client/modules/bitcoin/classes/bitcoin-block.class';
import {BitcoinTransaction} from '@client/modules/bitcoin/classes/bitcoin-transaction.class';
import {BitcoinBlockTemplate} from '@client/modules/bitcoin/classes/bitcoin-block-template.class';
import {BitcoinTransactionFeeEstimate} from '@client/modules/bitcoin/classes/bitcoin-transaction-fee-estimate.class';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
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
	public loading = input.required<boolean>();
	public enabled_oracle = input.required<boolean>();
	public bitcoin_oracle_price = input.required<BitcoinOraclePrice | null>();
	public enabled_lightning = input.required<boolean>();
	public enabled_taproot_assets = input.required<boolean>();
	public blockcount = input.required<number>();
	public blockchain_info = input.required<BitcoinBlockchainInfo | null>();
	public block = input.required<BitcoinBlock | null>();
	public block_template = input.required<BitcoinBlockTemplate | null>();
	public network_info = input.required<BitcoinNetworkInfo | null>();
	public mempool = input.required<BitcoinTransaction[]>();
	public txfee_estimate = input.required<BitcoinTransactionFeeEstimate | null>();
	public lightning_accounts = input.required<LightningAccount[]>();
	public taproot_assets = input.required<TaprootAssets>();
	public errors_lightning = input.required<OrchardError[]>();
	public errors_taproot_assets = input.required<OrchardError[]>();
	public form_group = input.required<FormGroup>();
	public control_name = input.required<string>();

	public target_change = output<number>();
}
