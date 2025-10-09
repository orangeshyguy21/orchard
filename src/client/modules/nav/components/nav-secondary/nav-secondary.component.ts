/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-nav-secondary',
	standalone: false,
	templateUrl: './nav-secondary.component.html',
	styleUrl: './nav-secondary.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavSecondaryComponent {}
