/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
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
    return this.mintInfoService.getMintInfo();
  }
}
