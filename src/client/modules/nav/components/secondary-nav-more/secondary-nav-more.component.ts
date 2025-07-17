/* Core Dependencies */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
/* Application Dependencies */
import { AuthService } from '@client/modules/auth/services/auth/auth.service';

@Component({
	selector: 'orc-secondary-nav-more',
	standalone: false,
	templateUrl: './secondary-nav-more.component.html',
	styleUrl: './secondary-nav-more.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondaryNavMoreComponent {

	constructor(
		private router: Router,
		private authService: AuthService
	) {}

	logout() {
		this.authService.revokeToken().subscribe();
		this.router.navigate(['/authentication']);
	}
}
