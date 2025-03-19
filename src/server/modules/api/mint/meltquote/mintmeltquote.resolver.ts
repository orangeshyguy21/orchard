/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintMeltQuoteService } from "./mintmeltquote.service";
import { OrchardMintMeltQuote } from "./mintmeltquote.model";

@Resolver(() => [OrchardMintMeltQuote])
export class MintMeltQuoteResolver {

    private readonly logger = new Logger(MintMeltQuoteResolver.name);

    constructor(
      private mintMeltQuoteService: MintMeltQuoteService,
    ) {}

    @Query(() => [OrchardMintMeltQuote])
    async mint_melt_quotes() : Promise<OrchardMintMeltQuote[]> {
		try {
			this.logger.debug('GET { mint_melt_quotes }');
			return await this.mintMeltQuoteService.getMintMeltQuotes();
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
    }
}
