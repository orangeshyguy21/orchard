/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {ErrorService} from '@server/modules/error/error.service';
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {LightningInfo} from '@server/modules/lightning/lightning/lightning.types';
/* Local Dependencies */
import {OrchardLightningInfo} from './lninfo.model';

@Injectable()
export class LightningInfoService {
	private readonly logger = new Logger(LightningInfoService.name);

	constructor(
		private lightningService: LightningService,
		private errorService: ErrorService,
	) {}

	async getLightningInfo(tag: string): Promise<OrchardLightningInfo> {
		try {
			const lightning_info: LightningInfo = await this.lightningService.getLightningInfo();
			return new OrchardLightningInfo(lightning_info);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.LightningRpcActionError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
