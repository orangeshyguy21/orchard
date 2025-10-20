/* Core Dependencies */
import {Injectable, ExecutionContext} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GqlExecutionContext} from '@nestjs/graphql';
import {Reflector} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Native Dependencies */
import {PUBLIC_KEY} from '@server/modules/security/decorators/auth.decorator';
import {NO_HEADERS_KEY} from '@server/modules/security/decorators/auth.decorator';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
	constructor(
		private configService: ConfigService,
		private reflector: Reflector,
	) {
		super();
	}
	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req;
	}

	canActivate(context: ExecutionContext) {
		const is_public = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);
		if (is_public) return true;
		const no_headers = this.reflector.getAllAndOverride<boolean>(NO_HEADERS_KEY, [context.getHandler(), context.getClass()]);
		if (no_headers) return true;
		// const production = this.configService.get<boolean>('mode.production');
		// if (!production) return true;
		return super.canActivate(context);
	}

	handleRequest(err: any, user: any) {
		// const production = this.configService.get<boolean>('mode.production');
		// if (!production) return {id: 'dev-user', username: 'dev'};
		if (err || !user) throw new OrchardApiError(OrchardErrorCode.AuthenticationError);
		return user;
	}
}
