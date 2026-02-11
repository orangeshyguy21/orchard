/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Inject, signal} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
/* Application Dependencies */
import {GraphicStatusState} from '@client/modules/graphic/types/graphic-status.types';
/* Native Dependencies */
import {NavSecondaryItem} from '@client/modules/nav/types/nav-secondary-item.type';

@Component({
	selector: 'orc-nav-mobile-sheet-menu-subsection',
	standalone: false,
	templateUrl: './nav-mobile-sheet-menu-subsection.component.html',
	styleUrl: './nav-mobile-sheet-menu-subsection.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMobileSheetMenuSubsectionComponent {
	public navigated_subsection = signal<string>('');
	public status: GraphicStatusState;

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA)
		public data: {
			items: NavSecondaryItem[];
			active_sub_section: string;
			enabled: boolean;
			online: boolean;
			syncing: boolean;
			icon: string;
			name: string;
		},
		private bottomSheetRef: MatBottomSheetRef<NavMobileSheetMenuSubsectionComponent>,
	) {
		this.status = this.deriveStatus(data.enabled, data.online, data.syncing);
	}

	public onItemClick(item: NavSecondaryItem) {
		this.navigated_subsection.set(item.subsection);
		this.bottomSheetRef.dismiss();
	}

	private deriveStatus(enabled: boolean, online: boolean, syncing: boolean = false): GraphicStatusState {
		if (!enabled) return null;
		if (online === false) return 'inactive';
		if (syncing === true) return 'warning';
		if (online === true) return 'active';
		return 'loading';
	}
}
