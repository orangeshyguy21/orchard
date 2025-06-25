/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Args, Mutation } from "@nestjs/graphql";
/* Application Dependencies */
import { AuthService } from '@server/modules/auth/auth.service';
/* Local Dependencies */
import { OrchardAuthLogin } from './authlogin.model';
import { AuthLoginInput } from './authlogin.input';

@Resolver(() => [OrchardAuthLogin])
export class AuthLoginResolver {

	private readonly logger = new Logger(AuthLoginResolver.name);

	constructor(
		private authService: AuthService,
	) {}

	@Mutation(() => OrchardAuthLogin)
    async login(@Args('auth_login') auth_login: AuthLoginInput) {
        const tag = 'MUTATION { auth_login }';
        this.logger.debug(tag);
        return await this.authService.getToken(auth_login.password);
    }
}