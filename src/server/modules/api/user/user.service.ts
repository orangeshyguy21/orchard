/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {UserService} from '@server/modules/user/user.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardUser} from './user.model';
import {UserNameUpdateInput, UserPasswordUpdateInput} from './user.input';

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
				errord: OrchardErrorCode.UserError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateUserName(tag: string, id: string, args: UserNameUpdateInput): Promise<OrchardUser> {
		try {
			const user = await this.userService.updateUser(id, {name: args.name});
			return new OrchardUser(user);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.UserError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateUserPassword(tag: string, id: string, args: UserPasswordUpdateInput): Promise<OrchardUser> {
		try {
			const user = await this.userService.getUserById(id);
			if (!user) throw OrchardErrorCode.UserError;
			const valid = await this.userService.validatePassword(user, args.password_old);
			if (!valid) throw OrchardErrorCode.InvalidPasswordError;
			const user_updated = await this.userService.updateUser(id, {}, args.password_new);
			return new OrchardUser(user_updated);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.UserError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
