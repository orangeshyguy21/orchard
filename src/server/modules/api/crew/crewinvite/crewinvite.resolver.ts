/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Context} from '@nestjs/graphql';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {CrewInviteService} from './crewinvite.service';
import {OrchardCrewInvite} from './crewinvite.model';

@Resolver()
export class CrewInviteResolver {
	private readonly logger = new Logger(CrewInviteResolver.name);

	constructor(private crewInviteService: CrewInviteService) {}

	@Query(() => [OrchardCrewInvite])
	async invites(@Context() context: any): Promise<OrchardCrewInvite[]> {
		const tag = 'GET { invites }';
		this.logger.debug(tag);
		const user = context.req.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.UserError);
		return await this.crewInviteService.getInvites(tag);
	}
}
