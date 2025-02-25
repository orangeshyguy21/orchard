/* Core Dependencies */
import { Resolver, Query} from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
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
    try {
      return this.mintBalanceService.getMintBalances();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }

  @Query(() => [OrchardMintBalance])
  async mint_balances_issued() : Promise<OrchardMintBalance[]> {
    try {
      return this.mintBalanceService.getIssuedMintBalances();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }

  @Query(() => [OrchardMintBalance])
  async mint_balances_redeemed() : Promise<OrchardMintBalance[]> {
    try {
      return this.mintBalanceService.getRedeemedMintBalances();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }
}