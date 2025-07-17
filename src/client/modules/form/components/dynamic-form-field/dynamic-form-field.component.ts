import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'orc-dynamic-form-field',
	standalone: false,
	templateUrl: './dynamic-form-field.component.html',
	styleUrl: './dynamic-form-field.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormFieldComponent {
	@Input() hot!: boolean;
	@Input() invalid!: boolean;
	@Input() subscript_sizing: 'default' | 'dynamic' = 'default';

	@Output() submit = new EventEmitter<Event>();
	@Output() cancel = new EventEmitter<Event>();
}
