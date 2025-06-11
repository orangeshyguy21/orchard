/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
/* Local Dependencies */
import { OrchardBitcoinInfo } from './btcinfo.model';
import { BitcoinInfoService } from './btcinfo.service';


@Resolver(() => OrchardBitcoinInfo)
export class BitcoinInfoResolver {

	private readonly logger = new Logger(BitcoinInfoResolver.name);
    
	constructor(
		private bitcoinInfoService: BitcoinInfoService,
	) {}

	@Query(() => OrchardBitcoinInfo)
	async bitcoin_info() : Promise<OrchardBitcoinInfo> {
		const tag = 'GET { bitcoin_info }';
		this.logger.debug(tag);
		return await this.bitcoinInfoService.getBitcoinInfo(tag);
	}
}