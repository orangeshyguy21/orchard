/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {BitcoinOracleService} from '@server/modules/bitcoin/oracle/oracle.service';
/* Local Dependencies */
import {OrchardOracleResult} from './btcoracle.model';

@Injectable()
export class BitcoinOracleApiService {
	private readonly logger = new Logger(BitcoinOracleApiService.name);

	constructor(
		private error_service: ErrorService,
		private oracle_service: BitcoinOracleService,
	) {}

	public async get_recent_oracle(tag: string = 'GET { bitcoin_oracle_recent }'): Promise<OrchardOracleResult> {
		try {
			const res = await this.oracle_service.runOracle({mode: 'recent'});
			return res as unknown as OrchardOracleResult;
		} catch (error) {
			const error_code = this.error_service.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	public async get_date_oracle(date: string, tag: string = 'GET { bitcoin_oracle_date }'): Promise<OrchardOracleResult> {
		try {
			const res = await this.oracle_service.runOracle({mode: 'date', date});
			return res as unknown as OrchardOracleResult;
		} catch (error) {
			const error_code = this.error_service.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
