/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
/* Local Dependencies */
import {ApiUserService} from './user.service';
import {OrchardUser} from './user.model';

@Resolver()
export class ApiUserResolver {
	private readonly logger = new Logger(ApiUserResolver.name);

	constructor(private apiUserService: ApiUserService) {}

	@Query(() => [OrchardUser])
	async user(@Args('id') id: string): Promise<OrchardUser> {
		const tag = 'GET { user }';
		this.logger.debug(tag);
		return await this.apiUserService.getUser(tag, id);
	}
}
