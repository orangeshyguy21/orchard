/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Int } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { MintUnit, MintQuoteState } from "@server/modules/cashu/cashu.enums";
/* Local Dependencies */
import { MintMintQuoteService } from "./mintmintquote.service";
import { OrchardMintMintQuote } from "./mintmintquote.model";
import { MintNut04UpdateInput, MintNut04QuoteUpdateInput } from "./mintmintquote.input";
import { OrchardMintNut04Update, OrchardMintNut04QuoteUpdate } from "./mintmintquote.model";

@Resolver()
export class MintMintQuoteResolver {

	private readonly logger = new Logger(MintMintQuoteResolver.name);

	constructor(
		private mintMintQuoteService: MintMintQuoteService,
	) {}

	@Query(() => [OrchardMintMintQuote])
	@UseGuards(GqlAuthGuard)
	async mint_mint_quotes(
		@Args('units', { type: () => [MintUnit], nullable: true }) units?: MintUnit[],
		@Args('states', { type: () => [MintQuoteState], nullable: true }) states?: MintQuoteState[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
		@Args('page', { type: () => Int, nullable: true }) page?: number,
		@Args('page_size', { type: () => Int, nullable: true }) page_size?: number,
	) : Promise<OrchardMintMintQuote[]> {
		const tag = 'GET { mint_mint_quotes }';
		this.logger.debug(tag);
		return await this.mintMintQuoteService.getMintMintQuotes(tag, { units, states, date_start, date_end, page, page_size });
	}

	@Mutation(() => OrchardMintNut04Update)
	@UseGuards(GqlAuthGuard)
	async mint_nut04_update(@Args('mint_nut04_update') mint_nut04_update: MintNut04UpdateInput): Promise<OrchardMintNut04Update> {
		const tag = 'MUTATION { mint_nut04_update }';
		this.logger.debug(tag);
		return await this.mintMintQuoteService.updateMintNut04(tag, mint_nut04_update);
	}

	@Mutation(() => OrchardMintNut04QuoteUpdate)
	@UseGuards(GqlAuthGuard)
	async mint_nut04_quote_update(@Args('mint_nut04_quote_update') mint_nut04_quote_update: MintNut04QuoteUpdateInput): Promise<OrchardMintNut04QuoteUpdate> {
		const tag = 'MUTATION { mint_nut04_quote_update }';
		this.logger.debug(tag);
		return await this.mintMintQuoteService.updateMintNut04Quote(tag, mint_nut04_quote_update);
	}
}