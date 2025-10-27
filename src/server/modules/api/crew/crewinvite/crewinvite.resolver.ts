/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Context, Mutation, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {CrewInviteService} from './crewinvite.service';
import {OrchardCrewInvite} from './crewinvite.model';
import {InviteCreateInput} from './crewinvite.input';

@Resolver()
export class CrewInviteResolver {
	private readonly logger = new Logger(CrewInviteResolver.name);

	constructor(private crewInviteService: CrewInviteService) {}

	@Query(() => [OrchardCrewInvite])
	async crew_invites(@Context() context: any): Promise<OrchardCrewInvite[]> {
		const tag = 'GET { crew_invites }';
		this.logger.debug(tag);
		const user = context.req.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.UserError);
		return await this.crewInviteService.getInvites(tag);
	}

	@Mutation(() => OrchardCrewInvite)
	async crew_invite_create(@Context() context: any, @Args('createInvite') createInvite: InviteCreateInput): Promise<OrchardCrewInvite> {
		const tag = 'MUTATION { crew_invite_create }';
		this.logger.debug(tag);
		const user = context.req.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.UserError);
		return await this.crewInviteService.createInvite(tag, user.id, createInvite);
	}
}
