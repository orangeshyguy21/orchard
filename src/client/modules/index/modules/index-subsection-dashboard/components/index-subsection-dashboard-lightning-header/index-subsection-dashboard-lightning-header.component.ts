/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed, signal, OnInit} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheet} from '@angular/material/bottom-sheet';
/* Application Dependencies */
import {NavService} from '@client/modules/nav/services/nav/nav.service';
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {NavSecondaryItem} from '@client/modules/nav/types/nav-secondary-item.type';
/* Components */
import {NavMobileSheetMenuSubsectionComponent} from '@client/modules/nav/components/nav-mobile-sheet-menu-subsection/nav-mobile-sheet-menu-subsection.component';

@Component({
	selector: 'orc-index-subsection-dashboard-lightning-header',
	standalone: false,
	templateUrl: './index-subsection-dashboard-lightning-header.component.html',
	styleUrl: './index-subsection-dashboard-lightning-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardLightningHeaderComponent implements OnInit {
	public enabled = input.required<boolean>();
	public loading = input.required<boolean>();
	public lightning_info = input.required<LightningInfo>();
	public error = input.required<boolean>();
	public mobile_view = input.required<boolean>();

	public items = signal<NavSecondaryItem[]>([]);

	public syncing = computed(() => {
		return !this.lightning_info()?.synced_to_chain || !this.lightning_info()?.synced_to_graph;
	});

	public state = computed(() => {
		if (this.error()) return 'offline';
		if (this.syncing()) return 'syncing';
		return 'online';
	});

	constructor(
		private bottomSheet: MatBottomSheet,
		private navService: NavService,
	) {}

	ngOnInit(): void {
		this.items.set(this.navService.getMenuItems('lightning'));
	}

	public onMenuClick() {
		this.bottomSheet.open(NavMobileSheetMenuSubsectionComponent, {
			autoFocus: false,
			data: {
				items: this.items(),
				active_sub_section: '',
				enabled: this.enabled(),
				online: !this.error(),
				syncing: this.syncing(),
				icon: 'bolt',
				name: 'Lightning',
			},
		});
	}
}
