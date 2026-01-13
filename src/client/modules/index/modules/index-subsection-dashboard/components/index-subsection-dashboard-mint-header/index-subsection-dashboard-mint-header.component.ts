/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal, computed, OnInit} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheet} from '@angular/material/bottom-sheet';
/* Application Dependencies */
import {NavService} from '@client/modules/nav/services/nav/nav.service';
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {NavSecondaryItem} from '@client/modules/nav/types/nav-secondary-item.type';
/* Components */
import {NavMobileSheetMenuSubsectionComponent} from '@client/modules/nav/components/nav-mobile-sheet-menu-subsection/nav-mobile-sheet-menu-subsection.component';

@Component({
	selector: 'orc-index-subsection-dashboard-mint-header',
	standalone: false,
	templateUrl: './index-subsection-dashboard-mint-header.component.html',
	styleUrl: './index-subsection-dashboard-mint-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardMintHeaderComponent implements OnInit {
	public enabled = input<boolean>();
	public loading = input<boolean>();
	public info = input<MintInfo>();
	public error = input<boolean>();
	public device_desktop = input<boolean>();

	public items = signal<NavSecondaryItem[]>([]);

	public state = computed(() => {
		if (this.error()) return 'offline';
		return 'online';
	});

	constructor(
		private bottomSheet: MatBottomSheet,
		private navService: NavService,
	) {}

	ngOnInit(): void {
		this.items.set(this.navService.getMenuItems('mint'));
	}

	public onMenuClick() {
		this.bottomSheet.open(NavMobileSheetMenuSubsectionComponent, {
			autoFocus: false,
			data: {
				items: this.items(),
				active_sub_section: '',
				enabled: this.enabled(),
				online: !this.error(),
				syncing: false,
				icon: 'account_balance',
				name: 'Mint',
			},
		});
	}
}
