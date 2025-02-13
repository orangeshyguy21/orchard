/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "../../graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintMeltQuoteService } from "./mintmeltquote.service";
import { OrchardMintMeltQuote } from "./mintmeltquote.model";

@Resolver(() => [OrchardMintMeltQuote])
export class MintMeltQuoteResolver {
  constructor(
    private mintMeltQuoteService: MintMeltQuoteService,
  ) {}

  @Query(() => [OrchardMintMeltQuote])
  async mint_melt_quotes() : Promise<OrchardMintMeltQuote[]> {
    try {
      return this.mintMeltQuoteService.getMintMeltQuotes();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }
}
