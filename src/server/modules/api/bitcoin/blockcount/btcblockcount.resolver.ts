/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Subscription, Query } from '@nestjs/graphql';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
/* Vendor Dependencies */
import { PubSub } from 'graphql-subscriptions';
/* Local Dependencies */
import { OrchardBitcoinBlockCount } from './btcblockcount.model';
import { BitcoinBlockCountService } from './btcblockcount.service';

const pubSub = new PubSub();

@Resolver(() => OrchardBitcoinBlockCount)
export class BitcoinBlockCountResolver {

	private readonly logger = new Logger(BitcoinBlockCountResolver.name);
	
	constructor(
		private bitcoinBlockCountService: BitcoinBlockCountService,
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
	async bitcoin_blockcount() : Promise<OrchardBitcoinBlockCount> {
		this.logger.debug('GET { bitcoin_blockcount }');
		return await this.bitcoinBlockCountService.getBlockCount();
	}

	@Subscription(() => OrchardBitcoinBlockCount, {
		name: 'blockCount',
		resolve: (value) => value.blockCount,
	})
	subscribeToBlockCount() {
		this.logger.debug('SUBSCRIPTION { bitcoin.blockcount }');
		return pubSub.asyncIterableIterator('bitcoin.blockcount');
	}
}