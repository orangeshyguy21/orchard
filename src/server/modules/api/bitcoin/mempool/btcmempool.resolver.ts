/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
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
	@UseGuards(GqlAuthGuard)
	async bitcoin_mempool() : Promise<OrchardBitcoinMempool> {
		const tag = 'GET { bitcoin_mempool }';
		this.logger.debug(tag);
		return await this.bitcoinMempoolService.getBitcoinMempool(tag);
	}
}