/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Vendor Dependencies */
import * as bcrypt from 'bcrypt';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {ErrorService} from '@server/modules/error/error.service';
import {UserService} from '@server/modules/user/user.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardAuthentication, OrchardInitialization} from './authentication.model';
import {InitializationInput, AuthenticationInput} from './authentication.input';

@Injectable()
export class AuthenticationService {
	private readonly logger = new Logger(AuthenticationService.name);

	constructor(
		private authService: AuthService,
		private errorService: ErrorService,
		private userService: UserService,
	) {}

	async initialize(tag: string, initialization: InitializationInput): Promise<OrchardAuthentication> {
		try {
			const valid = await this.authService.validateSetupKey(initialization.key);
			if (!valid) throw OrchardErrorCode.InitializationKeyError;
			const user = await this.userService.getUserByName(initialization.name);
			if (user) throw OrchardErrorCode.UniqueUsernameError;
			const newuser = await this.userService.createUser(initialization.name, initialization.password);
			const token = await this.authService.getToken(newuser.id, initialization.password);
			if (!token) throw OrchardErrorCode.AuthenticationError;
			return new OrchardAuthentication(token);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AuthenticationError,
			});
			throw new OrchardApiError(error_code);
		}
	}

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

	async authenticate(tag: string, authentication: AuthenticationInput): Promise<OrchardAuthentication> {
		try {
			const user = await this.userService.getUserByName(authentication.name);
			if (!user) throw OrchardErrorCode.AuthenticationError;
			const token = await this.authService.getToken(user.id, authentication.password);
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
