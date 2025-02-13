/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintKeysetService } from "./mintkeyset.service";
import { OrchardMintKeyset } from "./mintkeyset.model";

@Resolver(() => [OrchardMintKeyset])
export class MintKeysetResolver {
  constructor(
    private mintKeysetService: MintKeysetService,
  ) {}

  @Query(() => [OrchardMintKeyset])
  async mint_keysets() : Promise<OrchardMintKeyset[]> {
    try {
      return this.mintKeysetService.getMintKeysets();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }
}
