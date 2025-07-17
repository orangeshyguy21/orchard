/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query} from '@nestjs/graphql';
/* Local Dependencies */
import {OrchardBitcoinMempoolTransaction} from './btcmempool.model';
import {BitcoinMempoolService} from './btcmempool.service';

@Resolver()
export class BitcoinMempoolResolver {
	private readonly logger = new Logger(BitcoinMempoolResolver.name);

	constructor(private bitcoinMempoolService: BitcoinMempoolService) {}

	@Query(() => [OrchardBitcoinMempoolTransaction])
	async bitcoin_mempool_transactions(): Promise<OrchardBitcoinMempoolTransaction[]> {
		const tag = 'GET { bitcoin_mempool_transactions }';
		this.logger.debug(tag);
		return await this.bitcoinMempoolService.getBitcoinMempoolTransactions(tag);
	}
}
