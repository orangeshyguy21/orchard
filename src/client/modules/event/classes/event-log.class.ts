/* Application Dependencies */
import {
	OrchardEventLog,
	OrchardEventLogDetail,
	EventLogActorType,
	EventLogSection,
	EventLogEntityType,
	EventLogType,
	EventLogStatus,
	EventLogDetailStatus,
} from '@shared/generated.types';

export class EventLogDetail implements OrchardEventLogDetail {
	id: string;
	field: string;
	old_value: string | null;
	new_value: string | null;
	status: EventLogDetailStatus;
	error_code: string | null;
	error_message: string | null;

	constructor(detail: OrchardEventLogDetail) {
		this.id = detail.id;
		this.field = detail.field;
		this.old_value = detail.old_value ?? null;
		this.new_value = detail.new_value ?? null;
		this.status = detail.status;
		this.error_code = detail.error_code ?? null;
		this.error_message = detail.error_message ?? null;
	}
}

export class EventLog implements OrchardEventLog {
	id: string;
	actor_type: EventLogActorType;
	actor_id: string;
	timestamp: number;
	section: EventLogSection;
	section_id: string | null;
	entity_type: EventLogEntityType;
	entity_id: string | null;
	type: EventLogType;
	status: EventLogStatus;
	details: EventLogDetail[];

	constructor(log: OrchardEventLog) {
		this.id = log.id;
		this.actor_type = log.actor_type;
		this.actor_id = log.actor_id;
		this.timestamp = log.timestamp;
		this.section = log.section;
		this.section_id = log.section_id ?? null;
		this.entity_type = log.entity_type;
		this.entity_id = log.entity_id ?? null;
		this.type = log.type;
		this.status = log.status;
		this.details = (log.details ?? []).map((d) => new EventLogDetail(d));
	}
}
