import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'orc-add-form-array-item',
	standalone: false,
	templateUrl: './add-form-array-item.component.html',
	styleUrl: './add-form-array-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFormArrayItemComponent {

	@Output() addControl = new EventEmitter<void>();

}
