/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, effect, signal} from '@angular/core';
/* Native Dependencies */
import {EventData} from '@client/modules/event/classes/event-data.class';

@Component({
	selector: 'orc-event-stack',
	standalone: false,
	templateUrl: './event-stack.component.html',
	styleUrl: './event-stack.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventStackComponent {
	public active_event = input<EventData | null>(null);
	public stack = signal<EventData[]>([]);
	public moused = signal<boolean>(false);

	private marked_for_removal: string[] = [];

	constructor() {
		effect(() => {
			const active_event = this.active_event();
			this.sideEffectActiveEvent(active_event);
		});
	}

	private sideEffectActiveEvent(active_event: EventData | null): void {
		if (!active_event || !active_event.duration || active_event.duration <= 0) return;
		this.stack.update((prev) => [...prev, active_event]);
		setTimeout(() => this.clearEvent(active_event.id), active_event.duration || 0);
	}

	private clearEvent(id: string): any {
		if (this.moused()) return this.marked_for_removal.push(id);
		this.stack.update((events) => events.filter((e) => e.id !== id));
	}

	public onMouseEnter() {
		this.moused.set(true);
	}

	public onMouseLeave() {
		this.moused.set(false);
		this.marked_for_removal.forEach((id) => this.clearEvent(id));
		this.marked_for_removal = [];
	}
}
