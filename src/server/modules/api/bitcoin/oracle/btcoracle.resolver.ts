/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
import {Throttle, minutes} from '@nestjs/throttler';
/* Local Dependencies */
import {OrchardBitcoinOracle} from './btcoracle.model';
import {BitcoinOracleService} from './btcoracle.service';

@Resolver()
export class BitcoinOracleResolver {
	private readonly logger = new Logger(BitcoinOracleResolver.name);

	constructor(private bitcoinOracleService: BitcoinOracleService) {}

	@Query(() => OrchardBitcoinOracle)
	@Throttle({default: {limit: 2, ttl: minutes(60)}})
	async bitcoin_oracle_recent(
		@Args('include_intraday', {type: () => Boolean, nullable: true}) include_intraday?: boolean,
	): Promise<OrchardBitcoinOracle> {
		const tag = 'GET { bitcoin_oracle_recent }';
		this.logger.debug(tag);
		return await this.bitcoinOracleService.getRecentOracle(include_intraday, tag);
	}

	@Query(() => OrchardBitcoinOracle)
	@Throttle({default: {limit: 2, ttl: minutes(60)}})
	async bitcoin_oracle_date(
		@Args('date', {type: () => String}) date: string,
		@Args('include_intraday', {type: () => Boolean, nullable: true}) include_intraday?: boolean,
	): Promise<OrchardBitcoinOracle> {
		const tag = 'GET { bitcoin_oracle_date }';
		this.logger.debug(tag);
		return await this.bitcoinOracleService.getDateOracle(date, include_intraday, tag);
	}
}
