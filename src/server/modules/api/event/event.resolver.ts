/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {EventLogActorType, EventLogSection, EventLogEntityType, EventLogType, EventLogStatus} from '@server/modules/event/event.enums';
import {OrchardCommonCount} from '@server/modules/api/common/entity-count.model';
/* Local Dependencies */
import {ApiEventLogService} from './event.service';
import {OrchardEventLog} from './event.model';

@Resolver()
export class EventLogResolver {
    private readonly logger = new Logger(EventLogResolver.name);

    constructor(private eventLogService: ApiEventLogService) {}

    @Query(() => [OrchardEventLog])
    async event_logs(
        @Args('section', {type: () => EventLogSection, nullable: true}) section?: EventLogSection,
        @Args('actor_type', {type: () => EventLogActorType, nullable: true}) actor_type?: EventLogActorType,
        @Args('actor_id', {type: () => String, nullable: true}) actor_id?: string,
        @Args('type', {type: () => EventLogType, nullable: true}) type?: EventLogType,
        @Args('status', {type: () => EventLogStatus, nullable: true}) status?: EventLogStatus,
        @Args('entity_type', {type: () => EventLogEntityType, nullable: true}) entity_type?: EventLogEntityType,
        @Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
        @Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
        @Args('page', {type: () => Int, nullable: true}) page?: number,
        @Args('page_size', {type: () => Int, nullable: true}) page_size?: number,
    ): Promise<OrchardEventLog[]> {
        const tag = 'GET { event_logs }';
        this.logger.debug(tag);
        return await this.eventLogService.getEventLogs(tag, {
            section,
            actor_type,
            actor_id,
            type,
            status,
            entity_type,
            date_start,
            date_end,
            page,
            page_size,
        });
    }

    @Query(() => OrchardCommonCount)
    async event_log_count(
        @Args('section', {type: () => EventLogSection, nullable: true}) section?: EventLogSection,
        @Args('actor_type', {type: () => EventLogActorType, nullable: true}) actor_type?: EventLogActorType,
        @Args('actor_id', {type: () => String, nullable: true}) actor_id?: string,
        @Args('type', {type: () => EventLogType, nullable: true}) type?: EventLogType,
        @Args('status', {type: () => EventLogStatus, nullable: true}) status?: EventLogStatus,
        @Args('entity_type', {type: () => EventLogEntityType, nullable: true}) entity_type?: EventLogEntityType,
        @Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
        @Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
    ): Promise<OrchardCommonCount> {
        const tag = 'GET { event_log_count }';
        this.logger.debug(tag);
        return await this.eventLogService.getEventLogCount(tag, {
            section,
            actor_type,
            actor_id,
            type,
            status,
            entity_type,
            date_start,
            date_end,
        });
    }
}
