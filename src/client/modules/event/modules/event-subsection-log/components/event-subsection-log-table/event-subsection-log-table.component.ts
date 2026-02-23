/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
/* Vendor Dependencies */
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {User} from '@client/modules/crew/classes/user.class';
/* Native Dependencies */
import {EventLog} from '@client/modules/event/classes/event-log.class';
/* Shared Dependencies */
import {EventLogActorType, EventLogStatus} from '@shared/generated.types';

@Component({
    selector: 'orc-event-subsection-log-table',
    standalone: false,
    templateUrl: './event-subsection-log-table.component.html',
    styleUrl: './event-subsection-log-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogTableComponent {
    public readonly EventLogActorType = EventLogActorType;
    public readonly EventLogStatus = EventLogStatus;

    /* Inputs */
    public readonly data_source = input.required<MatTableDataSource<EventLog>>();
    public readonly loading = input.required<boolean>();
    public readonly error = input.required<boolean>();
    public readonly users = input.required<User[]>();
    public readonly device_desktop = input.required<boolean>();

    /* State */
    public more_entity: EventLog | null = null;

    /* Responsive columns */
    public readonly displayed_columns = computed(() => {
        if (!this.device_desktop()) return ['actor', 'change', 'timestamp'];
        return ['actor', 'section', 'change', 'change_summary', 'timestamp'];
    });

    /** Finds user by actor_id for display */
    public findUser(actor_id: string): User | undefined {
        return this.users().find((u) => u.id === actor_id);
    }

    /** Toggles expanded detail row */
    public toggleMore(entity: EventLog): void {
        this.more_entity = this.more_entity === entity ? null : entity;
    }
}
