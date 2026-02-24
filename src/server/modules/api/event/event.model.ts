/* Core Dependencies */
import {Field, ID, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {
	EventLogActorType,
	EventLogSection,
	EventLogEntityType,
	EventLogType,
	EventLogStatus,
	EventLogDetailStatus,
} from '@server/modules/event/event.enums';
import {EventLog} from '@server/modules/event/event.entity';
import {EventLogDetail} from '@server/modules/event/event-detail.entity';

@ObjectType()
export class OrchardEventLogDetail {
	@Field(() => ID)
	id: string;

	@Field()
	field: string;

	@Field({nullable: true})
	old_value: string | null;

	@Field({nullable: true})
	new_value: string | null;

	@Field(() => EventLogDetailStatus)
	status: EventLogDetailStatus;

	@Field({nullable: true})
	error_code: string | null;

	@Field({nullable: true})
	error_message: string | null;

	constructor(detail: EventLogDetail) {
		this.id = detail.id;
		this.field = detail.field;
		this.old_value = detail.old_value;
		this.new_value = detail.new_value;
		this.status = detail.status;
		this.error_code = detail.error_code;
		this.error_message = detail.error_message;
	}
}

@ObjectType()
export class OrchardEventLog {
	@Field(() => ID)
	id: string;

	@Field(() => EventLogActorType)
	actor_type: EventLogActorType;

	@Field()
	actor_id: string;

	@Field(() => UnixTimestamp)
	timestamp: number;

	@Field(() => EventLogSection)
	section: EventLogSection;

	@Field({nullable: true})
	section_id: string | null;

	@Field(() => EventLogEntityType)
	entity_type: EventLogEntityType;

	@Field({nullable: true})
	entity_id: string | null;

	@Field(() => EventLogType)
	type: EventLogType;

	@Field(() => EventLogStatus)
	status: EventLogStatus;

	@Field(() => [OrchardEventLogDetail])
	details: OrchardEventLogDetail[];

	constructor(event: EventLog) {
		this.id = event.id;
		this.actor_type = event.actor_type;
		this.actor_id = event.actor_id;
		this.timestamp = event.timestamp;
		this.section = event.section;
		this.section_id = event.section_id;
		this.entity_type = event.entity_type;
		this.entity_id = event.entity_id;
		this.type = event.type;
		this.status = event.status;
		this.details = (event.details ?? []).map((detail) => new OrchardEventLogDetail(detail));
	}
}
