/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "../../graphql/errors/orchard.errors";
/* Internal Dependencies */
import { MintInfoService } from "./mintinfo.service";
import { OrchardMintInfo } from "./mintinfo.model";

@Resolver(() => [OrchardMintInfo])
export class MintInfoResolver {
  constructor(
    private mintInfoService: MintInfoService,
  ) {}

  @Query(() => OrchardMintInfo)
  async mint_info() : Promise<OrchardMintInfo> {
    try {
      return this.mintInfoService.getMintInfo();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintApiError);
    } 
  }
}
