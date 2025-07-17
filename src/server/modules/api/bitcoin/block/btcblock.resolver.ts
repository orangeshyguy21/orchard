/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Local Dependencies */
import {BitcoinBlockService} from './btcblock.service';
import {OrchardBitcoinBlock, OrchardBitcoinBlockTemplate} from './btcblock.model';

@Resolver(() => OrchardBitcoinBlock)
export class BitcoinBlockResolver {
	// private interval_id: NodeJS.Timeout;
	// private event_emitter = new EventEmitter();
	// private block_count: number;
	private readonly logger = new Logger(BitcoinBlockResolver.name);

	constructor(private bitcoinBlockService: BitcoinBlockService) {}

	@Query(() => OrchardBitcoinBlock)
	async bitcoin_block(@Args('hash', {type: () => String}) hash: string): Promise<OrchardBitcoinBlock> {
		const tag = 'GET { bitcoin_block }';
		this.logger.debug(tag);
		return await this.bitcoinBlockService.getBlock(tag, hash);
	}

	@Query(() => OrchardBitcoinBlockTemplate)
	async bitcoin_block_template(): Promise<OrchardBitcoinBlockTemplate> {
		const tag = 'GET { bitcoin_block_template }';
		this.logger.debug(tag);
		return await this.bitcoinBlockService.getBlockTemplate(tag);
	}
}
