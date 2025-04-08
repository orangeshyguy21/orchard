/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { MintMeltQuoteService } from "./mintmeltquote.service";
import { OrchardMintMeltQuote } from "./mintmeltquote.model";
import { UpdateNut05Input } from "./mintmeltquote.input";
import { UpdateNut05Output } from "./mintmeltquote.model";

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


	@Mutation(() => UpdateNut05Output)
	async update_mint_nut05(@Args('updateNut05Input') updateNut05Input: UpdateNut05Input): Promise<UpdateNut05Output> {
		this.logger.debug(`MUTATION { update_mint_nut05 }`);
		return await this.mintMeltQuoteService.updateMintNut05(updateNut05Input);
	}
}
