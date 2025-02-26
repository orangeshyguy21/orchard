/* Core Dependencies */
import { Resolver, Query, Args, Info } from "@nestjs/graphql";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintPromiseService } from "./mintpromise.service";
import { OrchardMintPromise } from "./mintpromise.model";
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";

@Resolver(() => [OrchardMintPromise])
export class MintPromiseResolver {
  constructor(
    private mintPromiseService: MintPromiseService,
  ) {}

  @Query(() => [OrchardMintPromise])
  async mint_promises(
    @Args('id_keysets', { type: () => [String], nullable: true }) id_keysets?: string[],
    @Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
    @Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
    @Info() field_selection?: GraphQLResolveInfo,
  ) : Promise<OrchardMintPromise[]> {
    try {
      return this.mintPromiseService.getMintPromises(field_selection, { id_keysets, date_start, date_end });
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }
}
