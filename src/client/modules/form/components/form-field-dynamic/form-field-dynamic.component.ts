import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'orc-form-field-dynamic',
	standalone: false,
	templateUrl: './form-field-dynamic.component.html',
	styleUrl: './form-field-dynamic.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldDynamicComponent {
	@Input() hot!: boolean;
	@Input() invalid!: boolean;
	@Input() subscript_sizing: 'default' | 'dynamic' = 'default';

	@Output() submit = new EventEmitter<Event>();
	@Output() cancel = new EventEmitter<Event>();
}
