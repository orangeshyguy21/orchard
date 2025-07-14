/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
/* Local Dependencies */
import { BtcTransactionService } from './btctransaction.service';
import { OrchardBitcoinTxFeeEstimate } from './btctransaction.model';

@Resolver()
export class BtcTransactionResolver {

	private readonly logger = new Logger(BtcTransactionResolver.name);
	
	constructor(
		private btcTransactionService: BtcTransactionService,
	) {}
	
	@Query(() => [OrchardBitcoinTxFeeEstimate])
	async bitcoin_transaction_fee_estimates(
		@Args('targets', { type: () => [Int] }) targets: number[],
	) : Promise<OrchardBitcoinTxFeeEstimate[]> {
		const tag = 'GET { bitcoin_transaction_fee_estimates }';
		this.logger.debug(tag);
		return await this.btcTransactionService.getTransactionFeeEstimates(tag, targets);
	}
}

// @Args('units', { type: () => [MintUnit], nullable: true }) units?: MintUnit[],
// @Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
// @Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
// @Args('interval', { type: () => MintAnalyticsInterval, nullable: true }) interval?: MintAnalyticsInterval,
// @Args('timezone', { type: () => Timezone, nullable: true }) timezone?: TimezoneType,