/* Local Dependencies */
import {ChangeActorType, ChangeSection, ChangeEntityType, ChangeAction, ChangeStatus, ChangeDetailStatus} from './change.enums';

export interface CreateChangeEventInput {
    actor_type: ChangeActorType;
    actor_id: string;
    timestamp: number;
    section: ChangeSection;
    section_id?: string | null;
    entity_type: ChangeEntityType;
    entity_id?: string | null;
    action: ChangeAction;
    status: ChangeStatus;
    details: CreateChangeDetailInput[];
}

export interface CreateChangeDetailInput {
    field: string;
    old_value?: string | null;
    new_value?: string | null;
    status: ChangeDetailStatus;
    error_code?: string | null;
    error_message?: string | null;
}

export interface ChangeEventFilters {
    section?: ChangeSection;
    actor_type?: ChangeActorType;
    entity_type?: ChangeEntityType;
    action?: ChangeAction;
    status?: ChangeStatus;
    date_start?: number;
    date_end?: number;
    page?: number;
    page_size?: number;
}
