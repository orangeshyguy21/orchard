/* Core Dependencies */
import { Resolver, Query, ResolveField } from "@nestjs/graphql";
/* Application Dependencies */
import { LiabilitiesService } from "./liabilities.service";
import { Liabilities } from "./liabilities.model";


@Resolver(() => Liabilities)
export class LiabilitiesResolver {
  constructor(
    private liabilitiesService: LiabilitiesService,
  ) {}

  @Query(() => Liabilities)
  async liabilities() : Promise<Liabilities> {
    return this.liabilitiesService.getOutstandingLiabilites();
  }

  @ResolveField()
  total_issued() {
    return this.liabilitiesService.getIssuedLiabilities();
  }

  @ResolveField()
  total_redeemed() {
    return this.liabilitiesService.getRedeemedLiabilities();
  }
}
