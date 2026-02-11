/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, input, output, signal, viewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {MatMenuTrigger} from '@angular/material/menu';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
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
import {NavService} from '@client/modules/nav/services/nav/nav.service';
import {NavSecondaryItem} from '@client/modules/nav/types/nav-secondary-item.type';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {PublicPort} from '@client/modules/public/classes/public-port.class';
/* Components */
import {NavMobileSheetMenuSubsectionComponent} from '@client/modules/nav/components/nav-mobile-sheet-menu-subsection/nav-mobile-sheet-menu-subsection.component';

@Component({
	selector: 'orc-index-subsection-dashboard-bitcoin-enabled',
	standalone: false,
	templateUrl: './index-subsection-dashboard-bitcoin-enabled.component.html',
	styleUrl: './index-subsection-dashboard-bitcoin-enabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardBitcoinEnabledComponent implements OnInit {
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
	public errors_bitcoin = input.required<OrchardError[]>();
	public errors_lightning = input.required<OrchardError[]>();
	public errors_taproot_assets = input.required<OrchardError[]>();
	public form_group = input.required<FormGroup>();
	public control_name = input.required<string>();
	public device_type = input.required<DeviceType>();
	public connections = input<PublicPort[]>([]);

	private menu_trigger = viewChild(MatMenuTrigger);

	public items = signal<NavSecondaryItem[]>([]);
	public bitcoin_hovered = signal(false);

	public target_change = output<number>();

	constructor(
		private bottomSheet: MatBottomSheet,
		private navService: NavService,
	) {}

	ngOnInit(): void {
		const enabled_oracle = this.enabled_oracle();
		const items = this.navService.getMenuItems('bitcoin');
		if (enabled_oracle) {
			items.push({
				name: 'Oracle',
				navroute: 'bitcoin/oracle',
				subsection: 'oracle',
			});
		}
		this.items.set(items);
	}

	public onMenuClick() {
		this.device_type() === 'mobile' ? this.openMobileMenu() : this.openDesktopMenu();
	}

	private openDesktopMenu(): void {
		this.menu_trigger()?.openMenu();
	}

	private openMobileMenu(): void {
		this.bottomSheet.open(NavMobileSheetMenuSubsectionComponent, {
			autoFocus: false,
			data: {
				items: this.items(),
				active_sub_section: '',
				enabled: true,
				online: !this.errors_bitcoin().length,
				syncing: this.blockchain_info()?.initialblockdownload ?? false,
				icon: 'bitcoin',
				name: 'Bitcoin',
			},
		});
	}
}
