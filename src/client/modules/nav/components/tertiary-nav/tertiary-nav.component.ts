/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output, EventEmitter} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
/* Vendor Dependencies */
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
/* Native Dependencies */
import {TertiaryNavItem} from '@client/modules/nav/types/tertiary-nav-item.type';

@Component({
	selector: 'orc-tertiary-nav',
	standalone: false,
	templateUrl: './tertiary-nav.component.html',
	styleUrl: './tertiary-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
		trigger('orderUpdateAnimation', [
			state('visible', style({
				opacity: 1,
				transform: 'translateY(0)'
			})),
			state('hidden', style({
				opacity: 0,
				transform: 'translateY(-0.5rem)',
			})),
			transition('hidden => visible', animate('100ms ease-out')),
			transition('visible => hidden', animate('100ms ease-in', style({ opacity: 0 }))),
		]),
	],
})
export class TertiaryNavComponent {
	@Input() keys: string[] = [];
	@Input() items: Record<string, TertiaryNavItem> = {};
	@Input() revision?: number = 0;

	@Output() orderChange = new EventEmitter<string[]>();
	@Output() keySelect = new EventEmitter<string>();

	public order_update_animation_state: 'visible' | 'hidden' = 'hidden';
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
		this.order_update_animation_state = 'visible';
		this.cdr.detectChanges();
		this.order_update_timeout = setTimeout(() => {
			this.order_update_animation_state = 'hidden';
			this.cdr.detectChanges();
		}, 1000);
	}
}
