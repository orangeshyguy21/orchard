/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {ErrorService} from '@server/modules/error/error.service';
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {LightningChannelBalance} from '@server/modules/lightning/lightning/lightning.types';
/* Local Dependencies */
import {OrchardLightningBalance} from './lnbalance.model';

@Injectable()
export class LightningBalanceService {
	private readonly logger = new Logger(LightningBalanceService.name);

	constructor(
		private lightningService: LightningService,
		private errorService: ErrorService,
	) {}

	async getLightningChannelBalance(tag: string): Promise<OrchardLightningBalance> {
		try {
			const lcb: LightningChannelBalance = await this.lightningService.getLightningChannelBalance();
			return new OrchardLightningBalance(lcb);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.LightningRpcActionError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
