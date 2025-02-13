/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintPromiseService } from "./mintpromise.service";
import { OrchardMintPromise } from "./mintpromise.model";

@Resolver(() => [OrchardMintPromise])
export class MintPromiseResolver {
  constructor(
    private mintPromiseService: MintPromiseService,
  ) {}

  @Query(() => [OrchardMintPromise])
  async mint_promises() : Promise<OrchardMintPromise[]> {
    try {
      return this.mintPromiseService.getMintPromises();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }
}
