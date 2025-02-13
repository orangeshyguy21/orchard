/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintMintQuoteService } from "./mintmintquote.service";
import { OrchardMintMintQuote } from "./mintmintquote.model";

@Resolver(() => [OrchardMintMintQuote])
export class MintMintQuoteResolver {
  constructor(
    private mintMintQuoteService: MintMintQuoteService,
  ) {}

  @Query(() => [OrchardMintMintQuote])
  async mint_mint_quotes() : Promise<OrchardMintMintQuote[]> {
    try {
      return this.mintMintQuoteService.getMintMintQuotes();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }
}
