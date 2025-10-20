/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardAuthentication, OrchardInitialization} from './authentication.model';
import {AuthenticationInput} from './authentication.input';

@Injectable()
export class AuthenticationService {
	private readonly logger = new Logger(AuthenticationService.name);

	constructor(
		private authService: AuthService,
		private errorService: ErrorService,
	) {}

	async getInitialization(tag: string): Promise<OrchardInitialization> {
		try {
			const initialization = await this.authService.getInitialization();
			return new OrchardInitialization(initialization);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AuthenticationError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async getToken(tag: string, authentication: AuthenticationInput): Promise<OrchardAuthentication> {
		try {
			const token = await this.authService.getToken(authentication.name, authentication.password);
			if (!token) throw OrchardErrorCode.AuthenticationError;
			return new OrchardAuthentication(token);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AuthenticationError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async refreshToken(tag: string, refresh_token: string): Promise<OrchardAuthentication> {
		try {
			const token = await this.authService.refreshToken(refresh_token);
			if (!token) throw OrchardErrorCode.AuthenticationExpiredError;
			return new OrchardAuthentication(token);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AuthenticationExpiredError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async revokeToken(tag: string, token: string): Promise<boolean> {
		try {
			return this.authService.revokeToken(token);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AuthenticationExpiredError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
