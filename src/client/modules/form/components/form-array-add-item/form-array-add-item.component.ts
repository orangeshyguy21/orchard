import {ChangeDetectionStrategy, Component, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'orc-form-array-add-item',
	standalone: false,
	templateUrl: './form-array-add-item.component.html',
	styleUrl: './form-array-add-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayAddItemComponent {
	@Output() addControl = new EventEmitter<void>();
}
