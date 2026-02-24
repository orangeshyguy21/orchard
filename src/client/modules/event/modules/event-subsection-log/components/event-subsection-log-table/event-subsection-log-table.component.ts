/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
/* Vendor Dependencies */
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {User} from '@client/modules/crew/classes/user.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Native Dependencies */
import {EventLog} from '@client/modules/event/classes/event-log.class';
/* Shared Dependencies */
import {EventLogActorType, EventLogDetailStatus, EventLogStatus} from '@shared/generated.types';

@Component({
    selector: 'orc-event-subsection-log-table',
    standalone: false,
    templateUrl: './event-subsection-log-table.component.html',
    styleUrl: './event-subsection-log-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogTableComponent {
    public readonly EventLogActorType = EventLogActorType;
    public readonly EventLogDetailStatus = EventLogDetailStatus;
    public readonly EventLogStatus = EventLogStatus;

    /* Inputs */
    public readonly data_source = input.required<MatTableDataSource<EventLog>>();
    public readonly loading = input.required<boolean>();
    public readonly error = input.required<boolean>();
    public readonly users = input.required<User[]>();
    public readonly id_user = input.required<string | null>();
    public readonly device_type = input.required<DeviceType>();

    public more_entity: EventLog | null = null;

    public readonly displayed_columns = computed(() => {
        if (this.device_type() === 'mobile') return ['actor', 'event', 'timestamp'];
        if (this.device_type() === 'tablet') return ['actor', 'section', 'event', 'timestamp'];
        return ['actor', 'section', 'event', 'details', 'timestamp'];
    });
    public readonly event_time_type = computed(() => {
        if (this.device_type() === 'desktop') return 'medium';
        if (this.device_type() === 'tablet') return 'short';
        return 'date-only';
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
