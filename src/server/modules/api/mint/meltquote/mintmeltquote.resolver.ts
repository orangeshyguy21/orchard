/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { MintMeltQuoteService } from "./mintmeltquote.service";
import { OrchardMintMeltQuote } from "./mintmeltquote.model";
import { MintNut05UpdateInput } from "./mintmeltquote.input";
import { OrchardMintNut05Update } from "./mintmeltquote.model";

@Resolver(() => [OrchardMintMeltQuote])
export class MintMeltQuoteResolver {

    private readonly logger = new Logger(MintMeltQuoteResolver.name);

    constructor(
      	private mintMeltQuoteService: MintMeltQuoteService,
    ) {}

    @Query(() => [OrchardMintMeltQuote])
    async mint_melt_quotes() : Promise<OrchardMintMeltQuote[]> {
      	this.logger.debug('GET { mint_melt_quotes }');
		return await this.mintMeltQuoteService.getMintMeltQuotes();
    }

	@Mutation(() => OrchardMintNut05Update)
	async mint_nut05_update(@Args('mint_nut05_update') mint_nut05_update: MintNut05UpdateInput): Promise<OrchardMintNut05Update> {
		this.logger.debug(`MUTATION { mint_nut05_update }`);
		return await this.mintMeltQuoteService.updateMintNut05(mint_nut05_update);
	}
}