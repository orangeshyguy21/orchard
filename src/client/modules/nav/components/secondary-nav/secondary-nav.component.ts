/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-secondary-nav',
	standalone: false,
	templateUrl: './secondary-nav.component.html',
	styleUrl: './secondary-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryNavComponent {}
