/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Local Dependencies */
import { LightningWalletService } from "./lnwallet.service";
import { OrchardLightningAccount } from "./lnwallet.model";

@Resolver()
export class LightningWalletResolver {

	private readonly logger = new Logger(LightningWalletResolver.name);

	constructor(
		private lightningWalletService: LightningWalletService,
	) {}

	@Query(() => [OrchardLightningAccount])
	@UseGuards(GqlAuthGuard)
	async lightning_wallet() : Promise<OrchardLightningAccount[]> {
		const tag = 'GET { lightning_wallet }';
		this.logger.debug(tag);
		return await this.lightningWalletService.getListAccounts(tag);
	}
}