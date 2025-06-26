/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { AuthService } from '@server/modules/auth/auth.service';
import { ErrorService } from '@server/modules/error/error.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import { OrchardAuthentication } from './authentication.model';
import { AuthenticationInput } from './authentication.input';

@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name);

    constructor(
        private authService: AuthService,
        private errorService: ErrorService,
    ) {}
    
    async getToken(tag: string, authentication: AuthenticationInput): Promise<OrchardAuthentication> {
        try {
            const token = await this.authService.getToken(authentication.password);
            if(!token) throw OrchardErrorCode.AuthenticationError;
            return new OrchardAuthentication(token);
        } catch (error) {
            const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
                errord: OrchardErrorCode.AuthenticationError,
            });
            throw new OrchardApiError(error_code);
        }
    }

    async refreshToken(tag: string): Promise<OrchardAuthentication> {
        try {
            const token = await this.authService.refreshToken('');
            if(!token) throw OrchardErrorCode.AuthenticationError;
            return new OrchardAuthentication(token);
        } catch (error) {
            const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
                errord: OrchardErrorCode.AuthenticationError,
            });
            throw new OrchardApiError(error_code);
        }
    }
}