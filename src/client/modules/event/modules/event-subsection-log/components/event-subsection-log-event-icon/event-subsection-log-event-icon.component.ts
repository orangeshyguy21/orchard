/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Shared Dependencies */
import {EventLogType, EventLogStatus} from '@shared/generated.types';

@Component({
	selector: 'orc-event-subsection-log-event-icon',
	standalone: false,
	templateUrl: './event-subsection-log-event-icon.component.html',
	styleUrl: './event-subsection-log-event-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogEventIconComponent {
	public readonly type = input.required<EventLogType>();
	public readonly status = input.required<EventLogStatus>();

	public readonly icon = computed(() => {
		const type = this.type();
		if (type === EventLogType.Create) return 'add_circle';
		if (type === EventLogType.Delete) return 'delete_forever';
		if (type === EventLogType.Execute) return 'play_arrow';
		if (type === EventLogType.Update) return 'edit';
		return 'edit';
	});
}
