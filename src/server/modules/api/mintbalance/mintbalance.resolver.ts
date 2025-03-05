/* Core Dependencies */
import { Inject } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Internal Dependencies */
import { MintBalanceService } from "./mintbalance.service";
import { OrchardMintBalance } from "./mintbalance.model";

@Resolver(() => [OrchardMintBalance])
export class MintBalanceResolver {
  constructor(
    private mintBalanceService: MintBalanceService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => [OrchardMintBalance])
  async mint_balances() : Promise<OrchardMintBalance[]> {
    try {
      this.logger.debug('GET { mint_balances }', { context: this.constructor.name }); // @todo add this everywhere
      return this.mintBalanceService.getMintBalances();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }

  @Query(() => [OrchardMintBalance])
  async mint_balances_issued() : Promise<OrchardMintBalance[]> {
    try {
      this.logger.debug('GET { mint_balances_issued }', { context: this.constructor.name });
      return this.mintBalanceService.getIssuedMintBalances();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }

  @Query(() => [OrchardMintBalance])
  async mint_balances_redeemed() : Promise<OrchardMintBalance[]> {
    try {
      this.logger.debug('GET { mint_balances_redeemed }', { context: this.constructor.name });
      return this.mintBalanceService.getRedeemedMintBalances();
    } catch (error) {
      throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
    } 
  }
}