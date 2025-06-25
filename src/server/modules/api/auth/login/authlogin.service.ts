/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { AuthService } from '@server/modules/auth/auth.service';
import { ErrorService } from '@server/modules/error/error.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import { OrchardAuthLogin } from './authlogin.model';
import { AuthLoginInput } from './authlogin.input';

@Injectable()
export class AuthLoginService {
    private readonly logger = new Logger(AuthLoginService.name);

    constructor(
        private authService: AuthService,
        private errorService: ErrorService,
    ) {}
    
    async getToken(tag: string, auth_login: AuthLoginInput): Promise<OrchardAuthLogin> {
		try {
			const token = await this.authService.getToken(auth_login.password);
            if(!token) throw OrchardErrorCode.AuthenticationError;
			return new OrchardAuthLogin(token);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.AuthenticationError,
			});
			throw new OrchardApiError(error_code);
		}
	} 
}