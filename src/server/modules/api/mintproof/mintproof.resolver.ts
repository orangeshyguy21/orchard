/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintProofService } from "./mintproof.service";
import { OrchardMintProof } from "./mintproof.model";

@Resolver(() => [OrchardMintProof])
export class MintProofResolver {
  constructor(
    private mintProofService: MintProofService,
  ) {}

  @Query(() => [OrchardMintProof])
  async mint_proofs_pending() : Promise<OrchardMintProof[]> {
    try {
      return this.mintProofService.getMintProofsPending();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }

  @Query(() => [OrchardMintProof])
  async mint_proofs_used() : Promise<OrchardMintProof[]> {
    try {
      return this.mintProofService.getMintProofsUsed();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    }
  }
}
