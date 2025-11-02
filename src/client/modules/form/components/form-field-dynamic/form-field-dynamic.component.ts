/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';

@Component({
	selector: 'orc-form-field-dynamic',
	standalone: false,
	templateUrl: './form-field-dynamic.component.html',
	styleUrl: './form-field-dynamic.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldDynamicComponent {
	public hot = input<boolean>(false);
	public invalid = input<boolean>(false);
	public standalone = input<boolean>(true);
	public subscript_sizing = input<'default' | 'dynamic'>('default');

	public submit = output<Event>();
	public cancel = output<Event>();
}
