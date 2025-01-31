/* Core Dependencies */
import { Resolver, Query, ResolveField } from "@nestjs/graphql";
/* Application Dependencies */
import { MintBalanceService } from "./mintbalance.service";
import { OrchardMintBalance } from "./mintbalance.model";

@Resolver(() => OrchardMintBalance)
export class MintBalanceResolver {
  constructor(
    private mintBalanceService: MintBalanceService,
  ) {}

  @Query(() => OrchardMintBalance)
  async mint_balance() : Promise<OrchardMintBalance> {
    return this.mintBalanceService.getOutstandingMintBalance();
  }

  @ResolveField()
  total_issued() {
    return this.mintBalanceService.getIssuedMintBalance();
  }

  @ResolveField()
  total_redeemed() {
    return this.mintBalanceService.getRedeemedMintBalance();
  }
}