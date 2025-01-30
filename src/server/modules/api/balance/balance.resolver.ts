/* Core Dependencies */
import { Resolver, Query, ResolveField } from "@nestjs/graphql";
/* Application Dependencies */
import { BalanceService } from "./balance.service";
import { Balance } from "./balance.model";


@Resolver(() => Balance)
export class BalanceResolver {
  constructor(
    private balanceService: BalanceService,
  ) {}

  @Query(() => Balance)
  async liabilities() : Promise<Balance> {
    return this.balanceService.getOutstandingBalance();
  }

  @ResolveField()
  total_issued() {
    return this.balanceService.getIssuedBalance();
  }

  @ResolveField()
  total_redeemed() {
    return this.balanceService.getRedeemedBalance();
  }
}
