/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Native Dependencies */
import {TertiaryNavItemStatus} from '@client/modules/nav/enums/tertiary-nav-item-status.enum';

@Component({
	selector: 'orc-nav-tertiary-item',
	standalone: false,
	templateUrl: './nav-tertiary-item.component.html',
	styleUrl: './nav-tertiary-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTertiaryItemComponent {
	@Input() title!: string;
	@Input() subtitle?: string;
	@Input() status?: TertiaryNavItemStatus;

	public get status_class(): string {
		if (this.status === TertiaryNavItemStatus.Enabled) return 'orc-primary-color';
		if (this.status === TertiaryNavItemStatus.Disabled) return 'orc-outline-variant-color';
		return '';
	}
}
