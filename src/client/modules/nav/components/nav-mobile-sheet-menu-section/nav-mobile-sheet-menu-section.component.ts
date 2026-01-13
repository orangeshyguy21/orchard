/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Inject, signal, computed} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
/* Native Dependencies */

@Component({
	selector: 'orc-nav-mobile-sheet-menu-section',
	standalone: false,
	templateUrl: './nav-mobile-sheet-menu-section.component.html',
	styleUrl: './nav-mobile-sheet-menu-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMobileSheetMenuSectionComponent {
	public navigated_section = signal<string>('');
	public hovered = signal<string>('');

	public active_section = computed(() => {
		if (this.navigated_section() === '') return this.data.active_section;
		return this.navigated_section();
	});

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA)
		public data: {
			active_section: string;
			enabled_bitcoin: boolean;
			enabled_lightning: boolean;
			enabled_mint: boolean;
			online_bitcoin: boolean;
			online_lightning: boolean;
			online_mint: boolean;
			syncing_bitcoin: boolean;
			syncing_lightning: boolean;
		},
		private bottomSheetRef: MatBottomSheetRef<NavMobileSheetMenuSectionComponent>,
	) {}

	public onItemClick(section: string) {
		this.navigated_section.set(section);
		this.bottomSheetRef.dismiss();
	}
}
