/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
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
	async bitcoin_transaction_fee_estimates() : Promise<OrchardBitcoinTxFeeEstimate[]> {
		const tag = 'GET { bitcoin_transaction_fee_estimates }';
		this.logger.debug(tag);
		return await this.btcTransactionService.getTransactionFeeEstimates(tag);
	}
}