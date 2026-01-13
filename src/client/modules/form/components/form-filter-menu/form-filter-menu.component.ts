import {ChangeDetectionStrategy, Component, output} from '@angular/core';

@Component({
	selector: 'orc-form-filter-menu',
	standalone: false,
	templateUrl: './form-filter-menu.component.html',
	styleUrl: './form-filter-menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFilterMenuComponent {
	public clear = output<void>();
	public close = output<void>();
}
