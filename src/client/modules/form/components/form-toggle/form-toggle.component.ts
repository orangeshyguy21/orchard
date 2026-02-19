/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-form-toggle',
	standalone: false,
	templateUrl: './form-toggle.component.html',
	styleUrl: './form-toggle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormToggleComponent {
	public readonly selected = input<boolean>(false);
	public readonly disabled = input<boolean>(false);
}
