/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Mutation, Args, Context} from '@nestjs/graphql';
/* Local Dependencies */
import {ApiUserService} from './user.service';
import {OrchardUser} from './user.model';
import {UserNameUpdateInput, UserPasswordUpdateInput} from './user.input';

@Resolver()
export class ApiUserResolver {
	private readonly logger = new Logger(ApiUserResolver.name);

	constructor(private apiUserService: ApiUserService) {}

	@Query(() => OrchardUser)
	async user(@Context() context: any): Promise<OrchardUser> {
		const tag = 'GET { user }';
		this.logger.debug(tag);
		const user = context.req.user;
		return await this.apiUserService.getUser(tag, user.id);
	}

	@Mutation(() => OrchardUser)
	async updateUserName(@Context() context: any, @Args('updateUserName') updateUserName: UserNameUpdateInput): Promise<OrchardUser> {
		const tag = 'MUTATION { updateUserName }';
		this.logger.debug(tag);
		const user = context.req.user;
		return await this.apiUserService.updateUserName(tag, user.id, updateUserName);
	}

	@Mutation(() => OrchardUser)
	async updateUserPassword(
		@Context() context: any,
		@Args('updateUserPassword') updateUserPassword: UserPasswordUpdateInput,
	): Promise<OrchardUser> {
		const tag = 'MUTATION { updateUserPassword }';
		this.logger.debug(tag);
		const user = context.req.user;
		return await this.apiUserService.updateUserPassword(tag, user.id, updateUserPassword);
	}
}
