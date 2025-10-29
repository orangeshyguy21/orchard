/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Context, Mutation, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {UserRole} from '@server/modules/user/user.enums';
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
/* Local Dependencies */
import {CrewInviteService} from './crewinvite.service';
import {OrchardCrewInvite} from './crewinvite.model';
import {InviteCreateInput, InviteUpdateInput} from './crewinvite.input';

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

	@Roles(UserRole.ADMIN)
	@Mutation(() => OrchardCrewInvite)
	async crew_invite_create(@Context() context: any, @Args('createInvite') createInvite: InviteCreateInput): Promise<OrchardCrewInvite> {
		const tag = 'MUTATION { crew_invite_create }';
		this.logger.debug(tag);
		const user = context.req.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.UserError);
		return await this.crewInviteService.createInvite(tag, user.id, createInvite);
	}

	@Roles(UserRole.ADMIN)
	@Mutation(() => OrchardCrewInvite)
	async crew_invite_update(@Context() context: any, @Args('updateInvite') updateInvite: InviteUpdateInput): Promise<OrchardCrewInvite> {
		const tag = 'MUTATION { crew_invite_update }';
		const user = context.req.user;
		console.log(user);
		this.logger.debug(tag);
		return await this.crewInviteService.updateInvite(tag, updateInvite);
	}
}
