/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed, signal, effect} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheet} from '@angular/material/bottom-sheet';
/* Application Dependencies */
import {NavService} from '@client/modules/nav/services/nav/nav.service';
import {NavSecondaryItem} from '@client/modules/nav/types/nav-secondary-item.type';
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
/* Components */
import {NavMobileSheetMenuSubsectionComponent} from '@client/modules/nav/components/nav-mobile-sheet-menu-subsection/nav-mobile-sheet-menu-subsection.component';

@Component({
	selector: 'orc-index-subsection-dashboard-bitcoin-header',
	standalone: false,
	templateUrl: './index-subsection-dashboard-bitcoin-header.component.html',
	styleUrl: './index-subsection-dashboard-bitcoin-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardBitcoinHeaderComponent {
	public enabled = input.required<boolean>();
	public enabled_oracle = input.required<boolean>();
	public loading = input.required<boolean>();
	public network_info = input.required<BitcoinNetworkInfo | null>();
	public blockchain_info = input.required<BitcoinBlockchainInfo | null>();
	public error = input.required<boolean>();
	public device_desktop = input.required<boolean>();

	public items = signal<NavSecondaryItem[]>([]);

	public state = computed(() => {
		if (this.error()) return 'offline';
		if (this.blockchain_info()?.initialblockdownload) return 'syncing';
		return 'online';
	});

	constructor(
		private bottomSheet: MatBottomSheet,
		private navService: NavService,
	) {
		effect(() => {
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
		});
	}

	public onMenuClick() {
		this.bottomSheet.open(NavMobileSheetMenuSubsectionComponent, {
			autoFocus: false,
			data: {
				items: this.items(),
				active_sub_section: '',
				enabled: this.enabled(),
				online: !this.error(),
				syncing: this.blockchain_info()?.initialblockdownload ?? false,
				icon: 'bitcoin',
				name: 'Bitcoin',
			},
		});
	}
}
