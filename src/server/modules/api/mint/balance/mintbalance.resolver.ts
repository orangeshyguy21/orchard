/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Internal Dependencies */
import { MintBalanceService } from "./mintbalance.service";
import { OrchardMintBalance } from "./mintbalance.model";

@Resolver(() => [OrchardMintBalance])
export class MintBalanceResolver {

	private readonly logger = new Logger(MintBalanceResolver.name);

	constructor(
		private mintBalanceService: MintBalanceService,
	) {}

	@Query(() => [OrchardMintBalance])
	@UseGuards(GqlAuthGuard)
	async mint_balances(
		@Args('keyset_id', { type: () => String, nullable: true }) keyset_id?: string,
	) : Promise<OrchardMintBalance[]> {
		const tag = `GET { mint_balances ${keyset_id ? `for keyset ${keyset_id}` : ''} }`;
		this.logger.debug(tag);
		return await this.mintBalanceService.getMintBalances(tag, keyset_id);
	}

	@Query(() => [OrchardMintBalance])
	@UseGuards(GqlAuthGuard)
	async mint_balances_issued() : Promise<OrchardMintBalance[]> {
		const tag = 'GET { mint_balances_issued }';
		this.logger.debug(tag);
		return await this.mintBalanceService.getIssuedMintBalances(tag);
	}

	@Query(() => [OrchardMintBalance])
	@UseGuards(GqlAuthGuard)
	async mint_balances_redeemed() : Promise<OrchardMintBalance[]> {
		const tag = 'GET { mint_balances_redeemed }';
		this.logger.debug(tag);
		return await this.mintBalanceService.getRedeemedMintBalances(tag);
	}
}