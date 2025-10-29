/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {Throttle, seconds} from '@nestjs/throttler';
/* Application Dependencies */
import {Public} from '@server/modules/auth/decorators/auth.decorator';
/* Native Dependencies */
import {OrchardAuthentication} from '@server/modules/api/auth/authentication/authentication.model';
/* Local Dependencies */
import {AuthSignupService} from './authsignup.service';
import {AuthSignupInput} from './authsignup.input';

@Resolver(() => [OrchardAuthentication])
export class AuthSignupResolver {
	private readonly logger = new Logger(AuthSignupResolver.name);

	constructor(private signupService: AuthSignupService) {}

	@Public()
	@Throttle({default: {limit: 4, ttl: seconds(10)}})
	@Mutation(() => OrchardAuthentication)
	async auth_signup(@Args('signup') signup: AuthSignupInput) {
		const tag = 'MUTATION { signup }';
		this.logger.debug(tag);
		return await this.signupService.signup(tag, signup);
	}
}
