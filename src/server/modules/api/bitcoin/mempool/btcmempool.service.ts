/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardBitcoinMempoolTransaction} from './btcmempool.model';

@Injectable()
export class BitcoinMempoolService {
	private readonly logger = new Logger(BitcoinMempoolService.name);

	constructor(
		private bitcoinRpcService: BitcoinRpcService,
		private errorService: ErrorService,
	) {}

	public async getBitcoinMempoolTransactions(tag: string = 'GET { bitcoin_mempool }'): Promise<OrchardBitcoinMempoolTransaction[]> {
		try {
			const mempool = await this.bitcoinRpcService.getBitcoinMempool();
			return Object.entries(mempool).map(([txid, tx]) => new OrchardBitcoinMempoolTransaction(tx, txid));
		} catch (error) {
			const error_code = this.errorService.resolveError({
				logger: this.logger,
				error,
				msg: tag,
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
