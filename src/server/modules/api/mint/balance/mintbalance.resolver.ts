/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
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
	async mint_balances(
		@Args('keyset_id', { type: () => String, nullable: true }) keyset_id?: string,
	) : Promise<OrchardMintBalance[]> {
		const tag = `GET { mint_balances ${keyset_id ? `for keyset ${keyset_id}` : ''} }`;
		this.logger.debug(tag);
		return await this.mintBalanceService.getMintBalances(tag, keyset_id);
	}

	@Query(() => [OrchardMintBalance])
	async mint_balances_issued() : Promise<OrchardMintBalance[]> {
		this.logger.debug('GET { mint_balances_issued }');
		return await this.mintBalanceService.getIssuedMintBalances();
	}

	@Query(() => [OrchardMintBalance])
	async mint_balances_redeemed() : Promise<OrchardMintBalance[]> {
		this.logger.debug('GET { mint_balances_redeemed }');
		return await this.mintBalanceService.getRedeemedMintBalances();
	}
}