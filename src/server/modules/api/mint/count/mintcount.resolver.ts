/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit, MintQuoteState, MeltQuoteState} from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import {MintCountService} from './mintcount.service';
import {OrchardMintCount} from './mintcount.model';

@Resolver(() => OrchardMintCount)
export class MintCountResolver {
	private readonly logger = new Logger(MintCountResolver.name);

	constructor(private mintCountService: MintCountService) {}

	@Query(() => OrchardMintCount)
	async mint_count_mint_quotes(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('states', {type: () => [MintQuoteState], nullable: true}) states?: MintQuoteState[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
	): Promise<OrchardMintCount> {
		const tag = 'GET { mint_count_mint_quotes }';
		this.logger.debug(tag);
		return await this.mintCountService.getMintCountMintQuotes(tag, {units, states, date_start, date_end});
	}

	@Query(() => OrchardMintCount)
	async mint_count_melt_quotes(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('states', {type: () => [MeltQuoteState], nullable: true}) states?: MeltQuoteState[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
	): Promise<OrchardMintCount> {
		const tag = 'GET { mint_count_melt_quotes }';
		this.logger.debug(tag);
		return await this.mintCountService.getMintCountMeltQuotes(tag, {units, states, date_start, date_end});
	}

	@Query(() => OrchardMintCount)
	async mint_count_swaps(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('id_keysets', {type: () => [String], nullable: true}) id_keysets?: string[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
	): Promise<OrchardMintCount> {
		const tag = 'GET { mint_count_swaps }';
		this.logger.debug(tag);
		return await this.mintCountService.getMintCountSwaps(tag, {units, id_keysets, date_start, date_end});
	}
}
