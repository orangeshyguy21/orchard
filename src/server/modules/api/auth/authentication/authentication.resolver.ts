/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Args, Mutation } from "@nestjs/graphql";
import { UseGuards } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
/* Application Dependencies */
import { GqlRefreshGuard } from '@server/modules/graphql/guards/refresh.guard';
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

    @Mutation(() => OrchardAuthentication)
    @UseGuards(GqlRefreshGuard)
    async refreshToken(context: ExecutionContext) {
        const tag = 'MUTATION { refreshToken }';
        this.logger.debug(tag);
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        const user = req.user;
        return await this.authenticationService.refreshToken(tag, user.refresh_token);
    }
}