/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Native Dependencies */
import {TertiaryNavItemStatus} from '@client/modules/nav/enums/tertiary-nav-item-status.enum';
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

	public get status_class(): string {
		if (this.item.status === TertiaryNavItemStatus.Enabled) return 'orc-primary-color';
		if (this.item.status === TertiaryNavItemStatus.Disabled) return 'orc-outline-variant-color';
		return '';
	}
}

// 		@extend %orc-outline-variant-bg;

// @extend %orc-outline-variant-bg;
// @extend %orc-outline-color;
