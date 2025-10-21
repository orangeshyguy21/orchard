/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {ErrorService} from '@server/modules/error/error.service';
import {UserService} from '@server/modules/user/user.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Native Dependencies */
import {OrchardAuthentication} from '@server/modules/api/auth/authentication/authentication.model';
/* Local Dependencies */
import {OrchardInitialization} from './initialization.model';
import {InitializationInput} from './initialization.input';

@Injectable()
export class AuthInitializationService {
	private readonly logger = new Logger(AuthInitializationService.name);

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
}
