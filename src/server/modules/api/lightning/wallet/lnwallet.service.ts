/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { ErrorService } from '@server/modules/error/error.service';
import { LightningWalletKitService } from '@server/modules/lightning/walletkit/lnwalletkit.service';
import { LightningAddresses } from '@server/modules/lightning/walletkit/lnwalletkit.types';
/* Local Dependencies */    
import { OrchardLightningAccount } from './lnwallet.model';

@Injectable()
export class LightningWalletService {

    private readonly logger = new Logger(LightningWalletService.name);

	constructor(
		private lightningWalletKitService: LightningWalletKitService,
		private errorService: ErrorService,
	) {}

	async getListAccounts(tag: string) : Promise<OrchardLightningAccount[]> {
		try {
			const addresses : LightningAddresses = await this.lightningWalletKitService.getListAddresses();
            return addresses.account_with_addresses.map(account => new OrchardLightningAccount(account));
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.LightningRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}