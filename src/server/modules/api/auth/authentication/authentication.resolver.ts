/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Args, Mutation } from "@nestjs/graphql";
/* Local Dependencies */
import { AuthenticationService } from './authentication.service';
import { OrchardAuthentication } from './authentication.model';
import { AuthenticationInput } from './authentication.input';

@Resolver(() => [OrchardAuthentication])
export class AuthenticationResolver {

	private readonly logger = new Logger(AuthenticationResolver.name);

	constructor(
		private authenticationService: AuthenticationService,
	) {}

	@Mutation(() => OrchardAuthentication)
    async authentication(@Args('authentication') authentication: AuthenticationInput) {
        const tag = 'MUTATION { authentication }';
        this.logger.debug(tag);
        return await this.authenticationService.getToken(tag, authentication);
    }
}