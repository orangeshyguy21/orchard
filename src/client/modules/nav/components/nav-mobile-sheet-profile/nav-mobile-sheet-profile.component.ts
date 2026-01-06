/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
/* Vendor Dependencies */
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
/* Application Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';
import {CrewService} from '@client/modules/crew/services/crew/crew.service';

@Component({
	selector: 'orc-nav-mobile-sheet-profile',
	standalone: false,
	templateUrl: './nav-mobile-sheet-profile.component.html',
	styleUrl: './nav-mobile-sheet-profile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMobileSheetProfileComponent {
	constructor(
		private bottomSheetRef: MatBottomSheetRef<NavMobileSheetProfileComponent>,
		private authService: AuthService,
		private crewService: CrewService,
		private router: Router,
	) {}

	public logout() {
		this.authService.revokeToken().subscribe();
		this.crewService.clearUserCache();
		this.router.navigate(['/auth']);
		this.bottomSheetRef.dismiss();
	}
}
