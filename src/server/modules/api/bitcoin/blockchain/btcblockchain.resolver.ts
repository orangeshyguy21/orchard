/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Subscription, Query, Args } from '@nestjs/graphql';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
/* Vendor Dependencies */
import { PubSub } from 'graphql-subscriptions';
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Local Dependencies */
import { BitcoinBlockchainService } from './btcblockchain.service';
import { 
	OrchardBitcoinBlockCount, 
	OrchardBitcoinBlockchainInfo,
	OrchardBitcoinBlock,
} from './btcblockchain.model';

const pubSub = new PubSub();

@Resolver(() => OrchardBitcoinBlockCount)
export class BitcoinBlockchainResolver {

	private readonly logger = new Logger(BitcoinBlockchainResolver.name);
	
	constructor(
		private bitcoinBlockchainService: BitcoinBlockchainService,
	) {}
	
	// onModuleInit() {
	// 	this.bitcoinBlockCountService.startBlockCountPolling();
	// 	this.bitcoinBlockCountService.onBlockCountUpdate((block_count) => {
	// 		this.logger.debug(`New Block Found!: ${block_count}`);
	// 		pubSub.publish('bitcoin.blockcount', { blockCount: { block_count } });
	// 	});
	// }
	
	// onModuleDestroy() {
	// 	this.bitcoinBlockCountService.stopBlockCountPolling();
	// }

	@Query(() => OrchardBitcoinBlockCount)
	@UseGuards(GqlAuthGuard)
	async bitcoin_blockcount() : Promise<OrchardBitcoinBlockCount> {
		const tag = 'GET { bitcoin_blockcount }';
		this.logger.debug(tag);
		return await this.bitcoinBlockchainService.getBlockCount(tag);
	}

	@Subscription(() => OrchardBitcoinBlockCount, {
		name: 'blockCount',
		resolve: (value) => value.blockCount,
	})
	@UseGuards(GqlAuthGuard)
	subscribeToBlockCount() {
		this.logger.debug('SUBSCRIPTION { bitcoin.blockcount }');
		return pubSub.asyncIterableIterator('bitcoin.blockcount');
	}

	@Query(() => OrchardBitcoinBlockchainInfo)
	@UseGuards(GqlAuthGuard)
	async bitcoin_blockchain_info() : Promise<OrchardBitcoinBlockchainInfo> {
		const tag = 'GET { bitcoin_blockchain_info }';
		this.logger.debug(tag);
		return await this.bitcoinBlockchainService.getBlockchainInfo(tag);
	}

	@Query(() => OrchardBitcoinBlock)
	@UseGuards(GqlAuthGuard)
	async bitcoin_block(@Args('hash', { type: () => String }) hash: string) : Promise<OrchardBitcoinBlock> {
		const tag = 'GET { bitcoin_block }';
		this.logger.debug(tag);
		return await this.bitcoinBlockchainService.getBlock(tag, hash);
	}
}