/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {InviteService} from '@server/modules/invite/invite.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardCrewInvite} from './crewinvite.model';

@Injectable()
export class CrewInviteService {
	private readonly logger = new Logger(CrewInviteService.name);

	constructor(
		private errorService: ErrorService,
		private inviteService: InviteService,
	) {}

	async getInvites(tag: string): Promise<OrchardCrewInvite[]> {
		try {
			const invites = await this.inviteService.getInvites();
			return invites.map((invite) => new OrchardCrewInvite(invite));
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.UserError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
