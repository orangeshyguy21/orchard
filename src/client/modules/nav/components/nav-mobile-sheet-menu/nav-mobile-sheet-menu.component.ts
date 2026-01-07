/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Inject, signal} from '@angular/core';
import {Router} from '@angular/router';
/* Vendor Dependencies */
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
/* Native Dependencies */
import {NavSecondaryItem} from '@client/modules/nav/types/nav-secondary-item.type';
/* Application Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';
import {CrewService} from '@client/modules/crew/services/crew/crew.service';

@Component({
	selector: 'orc-nav-mobile-sheet-menu',
	standalone: false,
	templateUrl: './nav-mobile-sheet-menu.component.html',
	styleUrl: './nav-mobile-sheet-menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMobileSheetMenuComponent {
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
		},
		private bottomSheetRef: MatBottomSheetRef<NavMobileSheetMenuComponent>,
		private authService: AuthService,
		private crewService: CrewService,
		private router: Router,
	) {}

	public onItemClick(item: NavSecondaryItem) {
		this.navigated_subsection.set(item.subsection);
		this.bottomSheetRef.dismiss();
	}

	// public logout() {
	// 	this.authService.revokeToken().subscribe();
	// 	this.crewService.clearUserCache();
	// 	this.router.navigate(['/auth']);
	// 	this.bottomSheetRef.dismiss();
	// }
}
