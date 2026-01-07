/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Inject, signal, computed} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
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
	) {}

	public onItemClick(item: NavSecondaryItem) {
		this.navigated_subsection.set(item.subsection);
		this.bottomSheetRef.dismiss();
	}
}
