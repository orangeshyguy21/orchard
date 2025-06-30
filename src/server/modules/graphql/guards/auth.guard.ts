/* Core Dependencies */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
/* Application Dependencies */
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    constructor(private configService: ConfigService) {
        super();
    }
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    canActivate(context: ExecutionContext) {
        const production = this.configService.get<boolean>('mode.production');
        if (!production) return true;
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        const production = this.configService.get<boolean>('mode.production');
        if (!production) return { id: 'dev-user', username: 'dev' };
        if (err || !user) throw new OrchardApiError(OrchardErrorCode.AuthenticationError);
        return user;
    }
}