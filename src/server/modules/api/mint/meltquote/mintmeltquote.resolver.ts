/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit, MeltQuoteState} from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import {MintMeltQuoteService} from './mintmeltquote.service';
import {OrchardMintMeltQuote} from './mintmeltquote.model';
import {MintNut05UpdateInput} from './mintmeltquote.input';
import {OrchardMintNut05Update} from './mintmeltquote.model';

@Resolver()
export class MintMeltQuoteResolver {
	private readonly logger = new Logger(MintMeltQuoteResolver.name);

	constructor(private mintMeltQuoteService: MintMeltQuoteService) {}

	@Query(() => [OrchardMintMeltQuote])
	async mint_melt_quotes(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('states', {type: () => [MeltQuoteState], nullable: true}) states?: MeltQuoteState[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('page', {type: () => Int, nullable: true}) page?: number,
		@Args('page_size', {type: () => Int, nullable: true}) page_size?: number,
	): Promise<OrchardMintMeltQuote[]> {
		const tag = 'GET { mint_melt_quotes }';
		this.logger.debug(tag);
		return await this.mintMeltQuoteService.getMintMeltQuotes(tag, {units, states, date_start, date_end, page, page_size});
	}

	@Mutation(() => OrchardMintNut05Update)
	async mint_nut05_update(@Args('mint_nut05_update') mint_nut05_update: MintNut05UpdateInput): Promise<OrchardMintNut05Update> {
		const tag = 'MUTATION { mint_nut05_update }';
		this.logger.debug(tag);
		return await this.mintMeltQuoteService.updateMintNut05(tag, mint_nut05_update);
	}
}
