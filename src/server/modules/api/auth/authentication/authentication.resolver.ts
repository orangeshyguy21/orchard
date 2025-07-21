/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Args, Mutation, Context} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import {Throttle, seconds} from '@nestjs/throttler';
/* Application Dependencies */
import {GqlRefreshGuard} from '@server/modules/security/guards/refresh.guard';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {Public} from '@server/modules/security/decorators/auth.decorator';
/* Local Dependencies */
import {AuthenticationService} from './authentication.service';
import {OrchardAuthentication} from './authentication.model';
import {AuthenticationInput} from './authentication.input';

@Resolver(() => [OrchardAuthentication])
export class AuthenticationResolver {
	private readonly logger = new Logger(AuthenticationResolver.name);

	constructor(private authenticationService: AuthenticationService) {}

	@Public()
	@Throttle({default: {limit: 4, ttl: seconds(10)}})
	@Mutation(() => OrchardAuthentication)
	async authentication(@Args('authentication') authentication: AuthenticationInput) {
		const tag = 'MUTATION { authentication }';
		this.logger.debug(tag);
		return await this.authenticationService.getToken(tag, authentication);
	}

	@Mutation(() => OrchardAuthentication)
	@UseGuards(GqlRefreshGuard)
	async refresh_authentication(@Context() context: any) {
		const tag = 'MUTATION { refresh_authentication }';
		this.logger.debug(tag);
		const req = context.req;
		const user = req?.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.AuthenticationExpiredError);
		if (!user.refresh_token) throw new OrchardApiError(OrchardErrorCode.AuthenticationExpiredError);
		return await this.authenticationService.refreshToken(tag, user.refresh_token);
	}

	@Mutation(() => Boolean)
	@UseGuards(GqlRefreshGuard)
	async revoke_authentication(@Context() context: any) {
		const tag = 'MUTATION { revoke_authentication }';
		this.logger.debug(tag);
		const req = context.req;
		const user = req?.user;
		if (!user) throw new OrchardApiError(OrchardErrorCode.AuthenticationExpiredError);
		if (!user.refresh_token) throw new OrchardApiError(OrchardErrorCode.AuthenticationExpiredError);
		return await this.authenticationService.revokeToken(tag, user.refresh_token);
	}
}
