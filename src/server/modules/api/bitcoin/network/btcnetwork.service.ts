/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardBitcoinNetworkInfo} from './btcnetwork.model';

@Injectable()
export class BitcoinNetworkService {
	private readonly logger = new Logger(OrchardBitcoinNetworkInfo.name);

	constructor(
		private bitcoinRpcService: BitcoinRpcService,
		private errorService: ErrorService,
	) {}

	public async getBitcoinNetworkInfo(tag: string = 'GET { bitcoin_network_info }'): Promise<OrchardBitcoinNetworkInfo> {
		try {
			const info = await this.bitcoinRpcService.getBitcoinNetworkInfo();
			return new OrchardBitcoinNetworkInfo(info);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
