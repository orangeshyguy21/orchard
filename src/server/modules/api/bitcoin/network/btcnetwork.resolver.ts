/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Local Dependencies */
import { OrchardBitcoinNetworkInfo } from './btcnetwork.model';
import { BitcoinNetworkService } from './btcnetwork.service';


@Resolver()
export class BitcoinNetworkResolver {

	private readonly logger = new Logger(BitcoinNetworkResolver.name);
    
	constructor(
		private bitcoinNetworkService: BitcoinNetworkService,
	) {}

	@Query(() => OrchardBitcoinNetworkInfo)
	@UseGuards(GqlAuthGuard)
	async bitcoin_network_info() : Promise<OrchardBitcoinNetworkInfo> {
		const tag = 'GET { bitcoin_network_info }';
		this.logger.debug(tag);
		return await this.bitcoinNetworkService.getBitcoinNetworkInfo(tag);
	}
}