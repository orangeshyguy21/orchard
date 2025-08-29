/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {BitcoinUTXOracleService} from '@server/modules/bitcoin/utxoracle/utxoracle.service';
/* Local Dependencies */
import {OrchardBitcoinOracle} from './btcoracle.model';

@Injectable()
export class BitcoinOracleService {
	private readonly logger = new Logger(BitcoinOracleService.name);

	constructor(
		private errorService: ErrorService,
		private bitcoinUTXOracleService: BitcoinUTXOracleService,
	) {}

	public async getRecentOracle(tag: string = 'GET { bitcoin_oracle_recent }'): Promise<OrchardBitcoinOracle> {
		try {
			const res = await this.bitcoinUTXOracleService.runOracle({mode: 'recent'});
			return res as unknown as OrchardBitcoinOracle;
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	public async getDateOracle(date: string, tag: string = 'GET { bitcoin_oracle_date }'): Promise<OrchardBitcoinOracle> {
		try {
			const res = await this.bitcoinUTXOracleService.runOracle({mode: 'date', date});
			return res as unknown as OrchardBitcoinOracle;
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
