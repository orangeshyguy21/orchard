/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Local Dependencies */
import {OrchardBitcoinOracle} from './btcoracle.model';
import {BitcoinOracleService} from './btcoracle.service';

@Resolver()
export class BitcoinOracleResolver {
	private readonly logger = new Logger(BitcoinOracleResolver.name);

	constructor(private bitcoinOracleService: BitcoinOracleService) {}

	@Query(() => OrchardBitcoinOracle)
	async bitcoin_oracle_recent(): Promise<OrchardBitcoinOracle> {
		const tag = 'GET { bitcoin_oracle_recent }';
		this.logger.debug(tag);
		return await this.bitcoinOracleService.getRecentOracle(tag);
	}

	@Query(() => OrchardBitcoinOracle)
	async bitcoin_oracle_date(@Args('date', {type: () => String}) date: string): Promise<OrchardBitcoinOracle> {
		const tag = 'GET { bitcoin_oracle_date }';
		this.logger.debug(tag);
		return await this.bitcoinOracleService.getDateOracle(date, tag);
	}
}
