/* Core Dependencies */
import {Field, ID, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {ChangeActorType, ChangeSection, ChangeAction, ChangeStatus, ChangeDetailStatus} from '@server/modules/change/change.enums';
import {ChangeEvent} from '@server/modules/change/change-event.entity';
import {ChangeDetail} from '@server/modules/change/change-detail.entity';

@ObjectType()
export class OrchardChangeDetail {
    @Field(() => ID)
    id: string;

    @Field()
    field: string;

    @Field({nullable: true})
    old_value: string | null;

    @Field({nullable: true})
    new_value: string | null;

    @Field(() => ChangeDetailStatus)
    status: ChangeDetailStatus;

    @Field({nullable: true})
    error_code: string | null;

    @Field({nullable: true})
    error_message: string | null;

    constructor(detail: ChangeDetail) {
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
export class OrchardChangeEvent {
    @Field(() => ID)
    id: string;

    @Field(() => ChangeActorType)
    actor_type: ChangeActorType;

    @Field()
    actor_id: string;

    @Field(() => UnixTimestamp)
    timestamp: number;

    @Field(() => ChangeSection)
    section: ChangeSection;

    @Field({nullable: true})
    section_id: string | null;

    @Field()
    entity_type: string;

    @Field({nullable: true})
    entity_id: string | null;

    @Field(() => ChangeAction)
    action: ChangeAction;

    @Field(() => ChangeStatus)
    status: ChangeStatus;

    @Field(() => [OrchardChangeDetail])
    details: OrchardChangeDetail[];

    constructor(event: ChangeEvent) {
        this.id = event.id;
        this.actor_type = event.actor_type;
        this.actor_id = event.actor_id;
        this.timestamp = event.timestamp;
        this.section = event.section;
        this.section_id = event.section_id;
        this.entity_type = event.entity_type;
        this.entity_id = event.entity_id;
        this.action = event.action;
        this.status = event.status;
        this.details = (event.details ?? []).map((detail) => new OrchardChangeDetail(detail));
    }
}
