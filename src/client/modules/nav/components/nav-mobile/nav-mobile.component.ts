/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-nav-mobile',
	standalone: false,
	templateUrl: './nav-mobile.component.html',
	styleUrl: './nav-mobile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.collapsed]': '!opened()',
	},
})
export class NavMobileComponent {
	public opened = input.required<boolean>();
}
