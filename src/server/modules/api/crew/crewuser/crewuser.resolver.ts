/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Mutation, Args, Context} from '@nestjs/graphql';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {CrewUserService} from './crewuser.service';
import {OrchardCrewUser} from './crewuser.model';
import {UserNameUpdateInput, UserPasswordUpdateInput} from './crewuser.input';

@Resolver()
export class CrewUserResolver {
	private readonly logger = new Logger(CrewUserResolver.name);

	constructor(private crewUserService: CrewUserService) {}

	@Query(() => OrchardCrewUser)
	async crew_user(@Context() context: any): Promise<OrchardCrewUser> {
		const tag = 'GET { crew_user }';
		this.logger.debug(tag);
		const user = context.req.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.UserError);
		return await this.crewUserService.getUser(tag, user.id);
	}

	@Query(() => [OrchardCrewUser])
	async crew_users(): Promise<OrchardCrewUser[]> {
		const tag = 'GET { crew_users }';
		this.logger.debug(tag);
		return await this.crewUserService.getUsers(tag);
	}

	@Mutation(() => OrchardCrewUser)
	async crew_user_update_name(
		@Context() context: any,
		@Args('updateUserName') updateUserName: UserNameUpdateInput,
	): Promise<OrchardCrewUser> {
		const tag = 'MUTATION { crew_user_update_name }';
		this.logger.debug(tag);
		const user = context.req.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.UserError);
		return await this.crewUserService.updateUserName(tag, user.id, updateUserName);
	}

	@Mutation(() => OrchardCrewUser)
	async crew_user_update_password(
		@Context() context: any,
		@Args('updateUserPassword') updateUserPassword: UserPasswordUpdateInput,
	): Promise<OrchardCrewUser> {
		const tag = 'MUTATION { crew_user_update_password }';
		this.logger.debug(tag);
		const user = context.req.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.UserError);
		return await this.crewUserService.updateUserPassword(tag, user.id, updateUserPassword);
	}
}
