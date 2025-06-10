/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { ErrorService } from '@server/modules/error/error.service';
import { LightningRpcService } from '@server/modules/lightning/rpc/lnrpc.service';
import { LightningChannelBalance } from '@server/modules/lightning/rpc/lnrpc.types';
/* Local Dependencies */    
import { OrchardLightningBalance } from './lnbalance.model';

@Injectable()
export class LightningBalanceService {
    private readonly logger = new Logger(LightningBalanceService.name);

	constructor(
		private lightningRpcService: LightningRpcService,
		private errorService: ErrorService,
	) {}

	async getLightningChannelBalance(tag: string) : Promise<OrchardLightningBalance> {
		try {
			const lcb: LightningChannelBalance = await this.lightningRpcService.getLightningChannelBalance();
			return new OrchardLightningBalance(lcb);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.LightningRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}