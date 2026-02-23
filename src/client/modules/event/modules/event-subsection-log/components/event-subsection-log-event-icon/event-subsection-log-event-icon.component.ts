/* Core Dependencies */
import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
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
        if (type === EventLogType.Create) return 'add';
        if (type === EventLogType.Delete) return 'delete_forever';
        if (type === EventLogType.Execute) return 'play_arrow';
        if (type === EventLogType.Update) return 'edit';
        return 'edit';
    });

    public readonly status_color = computed(() => {
        const status = this.status();
        if (status === EventLogStatus.Success) return 'orc-tertiary-container-bg';
        if (status === EventLogStatus.Partial) return 'orc-on-warning-bg';
        if (status === EventLogStatus.Error) return 'orc-on-error-bg';
        return 'orc-tertiary-container-bg';
    });
}