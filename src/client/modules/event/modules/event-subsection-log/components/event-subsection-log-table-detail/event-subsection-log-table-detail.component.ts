/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Application Dependencies */
import {User} from '@client/modules/crew/classes/user.class';
/* Native Dependencies */
import {EventLog} from '@client/modules/event/classes/event-log.class';
/* Shared Dependencies */
import {EventLogDetailStatus} from '@shared/generated.types';

@Component({
    selector: 'orc-event-subsection-log-table-detail',
    standalone: false,
    templateUrl: './event-subsection-log-table-detail.component.html',
    styleUrl: './event-subsection-log-table-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogTableDetailComponent {
    public readonly EventLogDetailStatus = EventLogDetailStatus;

    public readonly event_log = input.required<EventLog>();
    public readonly users = input.required<User[]>();
    public readonly device_desktop = input.required<boolean>();

    /** Finds user by actor_id for display */
    public findUser(actor_id: string): User | undefined {
        return this.users().find((u) => u.id === actor_id);
    }
}
