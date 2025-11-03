/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
/* Application Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';
import {CrewService} from '@client/modules/crew/services/crew/crew.service';

@Component({
	selector: 'orc-nav-secondary-more',
	standalone: false,
	templateUrl: './nav-secondary-more.component.html',
	styleUrl: './nav-secondary-more.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavSecondaryMoreComponent {
	constructor(
		private router: Router,
		private authService: AuthService,
		private crewService: CrewService,
	) {}

	logout() {
		this.authService.revokeToken().subscribe();
		this.crewService.clearUserCache();
		this.router.navigate(['/auth']);
	}
}
