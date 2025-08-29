/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Local Dependencies */
import {OrchardOracleResult} from './btcoracle.model';
import {BitcoinOracleApiService} from './btcoracle.service';

@Resolver()
export class BitcoinOracleResolver {
	private readonly logger = new Logger(BitcoinOracleResolver.name);

	constructor(private oracle_api_service: BitcoinOracleApiService) {}

	@Query(() => OrchardOracleResult)
	async bitcoin_oracle_recent(): Promise<OrchardOracleResult> {
		const tag = 'GET { bitcoin_oracle_recent }';
		this.logger.debug(tag);
		return await this.oracle_api_service.get_recent_oracle(tag);
	}

	@Query(() => OrchardOracleResult)
	async bitcoin_oracle_date(@Args('date', {type: () => String}) date: string): Promise<OrchardOracleResult> {
		const tag = 'GET { bitcoin_oracle_date }';
		this.logger.debug(tag);
		return await this.oracle_api_service.get_date_oracle(date, tag);
	}
}
