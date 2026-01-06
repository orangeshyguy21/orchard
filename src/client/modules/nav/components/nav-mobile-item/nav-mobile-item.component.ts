/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';

@Component({
	selector: 'orc-nav-mobile-item',
	standalone: false,
	templateUrl: './nav-mobile-item.component.html',
	styleUrl: './nav-mobile-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMobileItemComponent {
	public icon = input.required<string>();
	public name = input.required<string>();

	public clicked = output<void>();
}
