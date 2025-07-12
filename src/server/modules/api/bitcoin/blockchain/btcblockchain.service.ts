/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { BitcoinRpcService } from '@server/modules/bitcoin/rpc/btcrpc.service';
import { ErrorService } from '@server/modules/error/error.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import { 
	OrchardBitcoinBlockCount, 
	OrchardBitcoinBlockchainInfo,
} from './btcblockchain.model';

@Injectable()
export class BitcoinBlockchainService {

	private readonly logger = new Logger(BitcoinBlockchainService.name);
	
	constructor(
		private bitcoinRpcService: BitcoinRpcService,
		private errorService: ErrorService,
	) {}

	public async getBlockchainInfo(tag: string): Promise<OrchardBitcoinBlockchainInfo> {
		try {
			const info = await this.bitcoinRpcService.getBitcoinBlockchainInfo();
			return new OrchardBitcoinBlockchainInfo(info);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}
	
	public async getBlockCount(tag: string): Promise<OrchardBitcoinBlockCount> {
		try {
			const block_count = await this.bitcoinRpcService.getBitcoinBlockCount();
			return new OrchardBitcoinBlockCount(block_count);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}