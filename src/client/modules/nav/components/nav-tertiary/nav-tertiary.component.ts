/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output, EventEmitter} from '@angular/core';
/* Vendor Dependencies */
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
/* Native Dependencies */
import {NavTertiaryItem} from '@client/modules/nav/types/nav-tertiary-item.type';

@Component({
	selector: 'orc-nav-tertiary',
	standalone: false,
	templateUrl: './nav-tertiary.component.html',
	styleUrl: './nav-tertiary.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTertiaryComponent {
	@Input() keys: string[] = [];
	@Input() items: Record<string, NavTertiaryItem> = {};
	@Input() revision?: number = 0;

	@Output() orderChange = new EventEmitter<string[]>();
	@Output() keySelect = new EventEmitter<string>();

	public update_feedback: boolean = false;
	private order_update_timeout: any;

	constructor(private cdr: ChangeDetectorRef) {}

	public onDrop(event: CdkDragDrop<string[]>) {
		const new_order = [...this.keys];
		moveItemInArray(new_order, event.previousIndex, event.currentIndex);
		this.orderChange.emit(new_order);
		this.showUpdateMessage();
	}

	public onClick(item: string) {
		this.keySelect.emit(item);
	}

	public showUpdateMessage(): void {
		if (this.order_update_timeout) clearTimeout(this.order_update_timeout);
		this.update_feedback = true;
		this.cdr.detectChanges();
		this.order_update_timeout = setTimeout(() => {
			this.update_feedback = false;
			this.cdr.detectChanges();
		}, 1000);
	}
}
