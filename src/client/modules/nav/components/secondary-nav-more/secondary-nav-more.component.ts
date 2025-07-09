/* Core Dependencies */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'orc-secondary-nav-more',
	standalone: false,
	templateUrl: './secondary-nav-more.component.html',
	styleUrl: './secondary-nav-more.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondaryNavMoreComponent {

	constructor(
		private router: Router
	) {}

	logout() {
		this.router.navigate(['/authentication']);
	}
}
