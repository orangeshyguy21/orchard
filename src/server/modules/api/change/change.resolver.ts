/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {ChangeActorType, ChangeSection, ChangeAction, ChangeStatus} from '@server/modules/change/change.enums';
/* Local Dependencies */
import {ApiChangeService} from './change.service';
import {OrchardChangeEvent} from './change.model';

@Resolver()
export class ChangeResolver {
    private readonly logger = new Logger(ChangeResolver.name);

    constructor(private changeService: ApiChangeService) {}

    @Query(() => [OrchardChangeEvent])
    async change_events(
        @Args('section', {type: () => ChangeSection, nullable: true}) section?: ChangeSection,
        @Args('actor_type', {type: () => ChangeActorType, nullable: true}) actor_type?: ChangeActorType,
        @Args('action', {type: () => ChangeAction, nullable: true}) action?: ChangeAction,
        @Args('status', {type: () => ChangeStatus, nullable: true}) status?: ChangeStatus,
        @Args('entity_type', {type: () => String, nullable: true}) entity_type?: string,
        @Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
        @Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
        @Args('page', {type: () => Int, nullable: true}) page?: number,
        @Args('page_size', {type: () => Int, nullable: true}) page_size?: number,
    ): Promise<OrchardChangeEvent[]> {
        const tag = 'GET { change_events }';
        this.logger.debug(tag);
        return await this.changeService.getChangeEvents(tag, {
            section,
            actor_type,
            action,
            status,
            entity_type,
            date_start,
            date_end,
            page,
            page_size,
        });
    }
}
