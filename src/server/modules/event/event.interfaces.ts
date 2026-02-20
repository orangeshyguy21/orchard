/* Local Dependencies */
import {EventLogActorType, EventLogSection, EventLogEntityType, EventLogType, EventLogStatus, EventLogDetailStatus} from './event.enums';

export interface CreateEventLogInput {
    actor_type: EventLogActorType;
    actor_id: string;
    timestamp: number;
    section: EventLogSection;
    section_id?: string | null;
    entity_type: EventLogEntityType;
    entity_id?: string | null;
    type: EventLogType;
    status: EventLogStatus;
    details: CreateEventLogDetailInput[];
}

export interface CreateEventLogDetailInput {
    field: string;
    old_value?: string | null;
    new_value?: string | null;
    status: EventLogDetailStatus;
    error_code?: string | null;
    error_message?: string | null;
}

export interface EventLogFilters {
    section?: EventLogSection;
    actor_type?: EventLogActorType;
    entity_type?: EventLogEntityType;
    type?: EventLogType;
    status?: EventLogStatus;
    date_start?: number;
    date_end?: number;
    page?: number;
    page_size?: number;
}
