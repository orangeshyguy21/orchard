/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
/* Local Dependencies */
import { OrchardBitcoinMempool } from './btcmempool.model';
import { BitcoinMempoolService } from './btcmempool.service';

@Resolver()
export class BitcoinMempoolResolver {

	private readonly logger = new Logger(BitcoinMempoolResolver.name);
    
	constructor(
		private bitcoinMempoolService: BitcoinMempoolService,
	) {}

	@Query(() => OrchardBitcoinMempool)
	async bitcoin_mempool() : Promise<OrchardBitcoinMempool> {
		const tag = 'GET { bitcoin_mempool }';
		this.logger.debug(tag);
		return await this.bitcoinMempoolService.getBitcoinMempool(tag);
	}
}