/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
/* Application Dependencies */
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { MintUnit, MintQuoteStatus } from "@server/modules/cashu/cashu.enums";
/* Local Dependencies */
import { MintMintQuoteService } from "./mintmintquote.service";
import { OrchardMintMintQuote } from "./mintmintquote.model";
import { UpdateNut04Input, UpdateNut04QuoteInput } from "./mintmintquote.input";
import { UpdateNut04Output, UpdateNut04QuoteOutput } from "./mintmintquote.model";

@Resolver(() => [OrchardMintMintQuote])
export class MintMintQuoteResolver {

	private readonly logger = new Logger(MintMintQuoteResolver.name);

	constructor(
		private mintMintQuoteService: MintMintQuoteService,
	) {}

	@Query(() => [OrchardMintMintQuote])
	async mint_mint_quotes(
		@Args('unit', { type: () => [MintUnit], nullable: true }) unit?: MintUnit[],
		@Args('status', { type: () => [MintQuoteStatus], nullable: true }) status?: MintQuoteStatus[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
	) : Promise<OrchardMintMintQuote[]> {
		this.logger.debug('GET { mint_mint_quotes }');
		return await this.mintMintQuoteService.getMintMintQuotes({ unit, status, date_start, date_end });
	}


	@Mutation(() => UpdateNut04Output)
	async update_mint_nut04(@Args('updateNut04Input') updateNut04Input: UpdateNut04Input): Promise<UpdateNut04Output> {
		this.logger.debug(`MUTATION { update_mint_nut04 }`);
		return await this.mintMintQuoteService.updateMintNut04(updateNut04Input);
	}

	@Mutation(() => UpdateNut04QuoteOutput)
	async update_mint_nut04_quote(@Args('updateNut04QuoteInput') updateNut04QuoteInput: UpdateNut04QuoteInput): Promise<UpdateNut04QuoteOutput> {
		this.logger.debug(`MUTATION { update_mint_nut04_quote }`);
		return await this.mintMintQuoteService.updateMintNut04Quote(updateNut04QuoteInput);
	}
}