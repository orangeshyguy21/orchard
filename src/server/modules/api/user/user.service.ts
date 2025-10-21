/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {UserService} from '@server/modules/user/user.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardUser} from './user.model';

@Injectable()
export class ApiUserService {
	private readonly logger = new Logger(ApiUserService.name);

	constructor(
		private errorService: ErrorService,
		private userService: UserService,
	) {}

	async getUser(tag: string, id: string): Promise<OrchardUser> {
		try {
			const user = await this.userService.getUserById(id);
			return new OrchardUser(user);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AuthenticationError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateUsername(tag: string, id: string, username: string): Promise<OrchardUser> {
		try {
			const user = await this.userService.updateUser(id, {name: username});
			return new OrchardUser(user);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AuthenticationError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateUserPassword(tag: string, id: string, password: string): Promise<OrchardUser> {
		try {
			const user = await this.userService.updateUser(id, {password_hash: password});
			return new OrchardUser(user);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AuthenticationError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
