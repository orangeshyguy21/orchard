/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {Throttle, seconds} from '@nestjs/throttler';
/* Application Dependencies */
import {Public} from '@server/modules/security/decorators/auth.decorator';
/* Native Dependencies */
import {OrchardAuthentication} from '@server/modules/api/auth/authentication/authentication.model';
/* Local Dependencies */
import {AtuhInitializationService} from './initialization.service';
import {OrchardInitialization} from './initialization.model';
import {InitializationInput} from './initialization.input';

@Resolver(() => [OrchardAuthentication])
export class AtuhInitializationResolver {
	private readonly logger = new Logger(AtuhInitializationResolver.name);

	constructor(private initializationService: AtuhInitializationService) {}

	@Public()
	@Query(() => OrchardInitialization)
	async auth_initialization() {
		const tag = 'GET { initialization }';
		this.logger.debug(tag);
		return await this.initializationService.getInitialization(tag);
	}

	@Public()
	@Throttle({default: {limit: 4, ttl: seconds(10)}})
	@Mutation(() => OrchardAuthentication)
	async auth_initialize(@Args('initialize') initialize: InitializationInput) {
		const tag = 'MUTATION { initialize }';
		this.logger.debug(tag);
		return await this.initializationService.initialize(tag, initialize);
	}
}
