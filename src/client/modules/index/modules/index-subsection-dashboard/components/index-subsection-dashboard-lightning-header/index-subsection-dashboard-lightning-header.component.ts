/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheet} from '@angular/material/bottom-sheet';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
/* Components */
import {NavMobileSheetMenuSubsectionComponent} from '@client/modules/nav/components/nav-mobile-sheet-menu-subsection/nav-mobile-sheet-menu-subsection.component';

@Component({
	selector: 'orc-index-subsection-dashboard-lightning-header',
	standalone: false,
	templateUrl: './index-subsection-dashboard-lightning-header.component.html',
	styleUrl: './index-subsection-dashboard-lightning-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardLightningHeaderComponent {
	public enabled = input.required<boolean>();
	public loading = input.required<boolean>();
	public lightning_info = input.required<LightningInfo>();
	public error = input.required<boolean>();
	public mobile_view = input.required<boolean>();

	public syncing = computed(() => {
		return !this.lightning_info()?.synced_to_chain || !this.lightning_info()?.synced_to_graph;
	});

	public state = computed(() => {
		if (this.error()) return 'offline';
		if (this.syncing()) return 'syncing';
		return 'online';
	});

	constructor(private bottomSheet: MatBottomSheet) {}

	public onMenuClick() {
		const items = [
			{
				name: 'Dashboard',
				navroute: 'lightning',
				subsection: 'dashboard',
			},
		];
		this.bottomSheet.open(NavMobileSheetMenuSubsectionComponent, {
			autoFocus: false,
			data: {
				items: items,
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
