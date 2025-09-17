/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {ErrorService} from '@server/modules/error/error.service';
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
/* Local Dependencies */
import {OrchardLightningRequest} from './lnrequest.model';

@Injectable()
export class LightningRequestService {
	private readonly logger = new Logger(LightningRequestService.name);

	constructor(
		private lightningService: LightningService,
		private errorService: ErrorService,
	) {}

	async getLightningRequest(tag: string, request: string): Promise<any> {
		try {
			const lightning_request: any = await this.lightningService.getLightningRequest(request);
			return new OrchardLightningRequest(lightning_request);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.LightningRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
