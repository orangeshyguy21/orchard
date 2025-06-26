/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Local Dependencies */
import { LightningBalanceService } from "./lnbalance.service";
import { OrchardLightningBalance } from "./lnbalance.model";


@Resolver()
export class LightningBalanceResolver {

	private readonly logger = new Logger(LightningBalanceResolver.name);

	constructor(
		private lightningBalanceService: LightningBalanceService,
	) {}

	@Query(() => OrchardLightningBalance)
	@UseGuards(GqlAuthGuard)
	async lightning_balance() : Promise<OrchardLightningBalance> {
		const tag = 'GET { lightning_balance }';
		this.logger.debug(tag);
		return await this.lightningBalanceService.getLightningChannelBalance(tag);
	}
}