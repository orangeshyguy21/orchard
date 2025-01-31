/* Core Dependencies */
import { Resolver, Query, ResolveField, Parent, Int } from "@nestjs/graphql";
/* Internal Dependencies */
import { MintBalanceService } from "./mintbalance.service";
import { OrchardMintBalance } from "./mintbalance.model";

@Resolver(() => [OrchardMintBalance])
export class MintBalanceResolver {
  constructor(
    private mintBalanceService: MintBalanceService,
  ) {}

  @Query(() => [OrchardMintBalance])
  async mint_balances() : Promise<OrchardMintBalance[]> {
    // @TODO : find a way so that the calls only fire if their respective field is requested.
    const outstanding = await this.mintBalanceService.getOutstandingMintBalances();
    const issued = await this.mintBalanceService.getIssuedMintBalances();
    const redeemed = await this.mintBalanceService.getRedeemedMintBalances();
    return outstanding.map( (balance, index) => new OrchardMintBalance(balance, issued[index], redeemed[index] ));   
  }
}