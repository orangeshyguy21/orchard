/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Native Dependencies */
import {TertiaryNavItem} from '@client/modules/nav/types/tertiary-nav-item.type';

@Component({
	selector: 'orc-tertiary-nav-item',
	standalone: false,
	templateUrl: './tertiary-nav-item.component.html',
	styleUrl: './tertiary-nav-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TertiaryNavItemComponent {
	@Input() item!: TertiaryNavItem;
}
