/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
/* Application Dependencies */
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { MintUnit, MintQuoteStatus } from "@server/modules/cashu/cashu.enums";
/* Local Dependencies */
import { MintMintQuoteService } from "./mintmintquote.service";
import { OrchardMintMintQuote } from "./mintmintquote.model";
import { MintNut04UpdateInput, MintNut04QuoteUpdateInput } from "./mintmintquote.input";
import { OrchardMintNut04Update, OrchardMintNut04QuoteUpdate } from "./mintmintquote.model";

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


	@Mutation(() => OrchardMintNut04Update)
	async mint_nut04_update(@Args('mint_nut04_update') mint_nut04_update: MintNut04UpdateInput): Promise<OrchardMintNut04Update> {
		this.logger.debug(`MUTATION { mint_nut04_update }`);
		return await this.mintMintQuoteService.updateMintNut04(mint_nut04_update);
	}

	@Mutation(() => OrchardMintNut04QuoteUpdate)
	async mint_nut04_quote_update(@Args('mint_nut04_quote_update') mint_nut04_quote_update: MintNut04QuoteUpdateInput): Promise<OrchardMintNut04QuoteUpdate> {
		this.logger.debug(`MUTATION { mint_nut04_quote_update }`);
		return await this.mintMintQuoteService.updateMintNut04Quote(mint_nut04_quote_update);
	}
}