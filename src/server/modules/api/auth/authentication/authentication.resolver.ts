/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Args, Mutation, Context} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import {Throttle, seconds} from '@nestjs/throttler';
/* Application Dependencies */
import {GqlRefreshGuard} from '@server/modules/security/guards/refresh.guard';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {Public} from '@server/modules/auth/decorators/auth.decorator';
/* Local Dependencies */
import {AuthAuthenticationService} from './authentication.service';
import {OrchardAuthentication} from './authentication.model';
import {AuthenticationInput} from './authentication.input';

@Resolver(() => [OrchardAuthentication])
export class AuthAuthenticationResolver {
	private readonly logger = new Logger(AuthAuthenticationResolver.name);

	constructor(private authenticationService: AuthAuthenticationService) {}

	@Public()
	@Throttle({default: {limit: 4, ttl: seconds(10)}})
	@Mutation(() => OrchardAuthentication)
	async auth_authentication(@Args('authentication') authentication: AuthenticationInput) {
		const tag = 'MUTATION { authentication }';
		this.logger.debug(tag);
		return await this.authenticationService.authenticate(tag, authentication);
	}

	@Mutation(() => OrchardAuthentication)
	@UseGuards(GqlRefreshGuard)
	async auth_authentication_refresh(@Context() context: any) {
		const tag = 'MUTATION { refresh_authentication }';
		this.logger.debug(tag);
		const req = context.req;
		const user = req?.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.AuthenticationExpiredError);
		if (!user.refresh_token) throw new OrchardApiError(OrchardErrorCode.AuthenticationExpiredError);
		return await this.authenticationService.refreshAuthentication(tag, user.refresh_token);
	}

	@Mutation(() => Boolean)
	@UseGuards(GqlRefreshGuard)
	async auth_authentication_revoke(@Context() context: any) {
		const tag = 'MUTATION { revoke_authentication }';
		this.logger.debug(tag);
		const req = context.req;
		const user = req?.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.AuthenticationExpiredError);
		if (!user.refresh_token) throw new OrchardApiError(OrchardErrorCode.AuthenticationExpiredError);
		return await this.authenticationService.revokeAuthentication(tag, user.refresh_token);
	}
}
