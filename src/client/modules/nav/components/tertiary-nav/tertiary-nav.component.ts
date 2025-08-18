/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';
/* Vendor Dependencies */
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
/* Native Dependencies */
import {TertiaryNavItem} from '@client/modules/nav/types/tertiary-nav-item.type';

@Component({
	selector: 'orc-tertiary-nav',
	standalone: false,
	templateUrl: './tertiary-nav.component.html',
	styleUrl: './tertiary-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TertiaryNavComponent {
	@Input() keys: string[] = [];
	@Input() items: Record<string, TertiaryNavItem> = {};

	@Output() orderChange = new EventEmitter<string[]>();
	@Output() keySelect = new EventEmitter<string>();

	constructor() {}

	public onDrop(event: CdkDragDrop<string[]>) {
		const new_order = [...this.keys];
		moveItemInArray(new_order, event.previousIndex, event.currentIndex);
		this.orderChange.emit(new_order);
	}

	public onClick(item: string) {
		this.keySelect.emit(item);
	}
}
