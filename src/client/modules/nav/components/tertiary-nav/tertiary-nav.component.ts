/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';
/* Vendor Dependencies */
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
	selector: 'orc-tertiary-nav',
	standalone: false,
	templateUrl: './tertiary-nav.component.html',
	styleUrl: './tertiary-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TertiaryNavComponent {
	@Input() items: string[] = [];

	@Output() itemsChange = new EventEmitter<string[]>();
	@Output() itemSelect = new EventEmitter<string>();

	constructor() {}

	public onDrop(event: CdkDragDrop<string[]>) {
		const new_items = [...this.items];
		moveItemInArray(new_items, event.previousIndex, event.currentIndex);
		this.itemsChange.emit(new_items);
	}

	public onClick(item: string) {
		this.itemSelect.emit(item);
	}
}
