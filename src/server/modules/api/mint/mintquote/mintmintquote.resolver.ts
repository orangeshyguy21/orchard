/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
/* Application Dependencies */
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { Timezone, TimezoneType } from "@server/modules/graphql/scalars/timezone.scalar";
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
	async mint_mint_quotes(
		@Args('unit', { type: () => [MintUnit], nullable: true }) unit?: MintUnit[],
		@Args('state', { type: () => [MintQuoteState], nullable: true }) state?: MintQuoteState[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
		@Args('timezone', { type: () => Timezone, nullable: true }) timezone?: TimezoneType,
	) : Promise<OrchardMintMintQuote[]> {
		this.logger.debug('GET { mint_mint_quotes }');
		return await this.mintMintQuoteService.getMintMintQuotes({ unit, state, date_start, date_end, timezone });
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