/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
/* Application Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';

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
	) {}

	logout() {
		this.authService.revokeToken().subscribe();
		this.router.navigate(['/auth']);
	}
}
