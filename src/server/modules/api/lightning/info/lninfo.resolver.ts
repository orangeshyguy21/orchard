/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Local Dependencies */
import { LightningInfoService } from "./lninfo.service";
import { OrchardLightningInfo } from "./lninfo.model";

@Resolver()
export class LightningInfoResolver {

	private readonly logger = new Logger(LightningInfoResolver.name);

	constructor(
		private lightningInfoService: LightningInfoService,
	) {}

	@Query(() => OrchardLightningInfo)
	@UseGuards(GqlAuthGuard)
	async lightning_info() : Promise<OrchardLightningInfo> {
		const tag = 'GET { lightning_info }';
		this.logger.debug(tag);
		return await this.lightningInfoService.getLightningInfo(tag);
	}
}