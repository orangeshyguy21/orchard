/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Native Dependencies */
import {EventData} from '@client/modules/event/classes/event-data.class';

@Component({
	selector: 'orc-event-general-stack-message',
	standalone: false,
	templateUrl: './event-general-stack-message.component.html',
	styleUrl: './event-general-stack-message.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventGeneralStackMessageComponent {
	public event = input<EventData | null>(null);

	public event_type_class = computed(() => {
		const event_type = this.event()?.type;
		if (event_type === 'SUCCESS') return 'event-success';
		if (event_type === 'WARNING') return 'event-warning';
		if (event_type === 'ERROR') return 'event-error';
		return '';
	});
}
