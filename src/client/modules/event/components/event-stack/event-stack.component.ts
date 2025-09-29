/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, effect, signal, untracked} from '@angular/core';
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

	constructor() {
		effect(() => {
			this.sideEffectActiveEvent();
		});
	}

	private sideEffectActiveEvent(): void {
		const action_event = this.active_event();
		if (!action_event || !action_event.duration || action_event.duration <= 0) return;
		untracked(() => {
			this.stack.update((prev) => [...prev, action_event]);
			setTimeout(() => this.clearEvent(action_event.id), action_event.duration || 0);
		});
	}

	private clearEvent(id: string): void {
		this.stack.update((events) => events.filter((e) => e.id !== id));
	}
}
