/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { BitcoinRpcService } from '@server/modules/bitcoin/rpc/btcrpc.service';
import { ErrorService } from '@server/modules/error/error.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import { OrchardBitcoinInfo } from './btcinfo.model';

@Injectable()
export class BitcoinInfoService {

    private readonly logger = new Logger(BitcoinInfoService.name);
	
	constructor(
		private bitcoinRpcService: BitcoinRpcService,
		private errorService: ErrorService,
	) {}
	
	public async getBitcoinInfo(tag: string = 'GET { bitcoin_info }'): Promise<OrchardBitcoinInfo> {
		try {
			const info = await this.bitcoinRpcService.getBitcoinInfo();
			console.log(info);
			return new OrchardBitcoinInfo(info);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}

