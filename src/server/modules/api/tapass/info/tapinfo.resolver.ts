/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Local Dependencies */
import { TaprootAssetsInfoService } from "./tapinfo.service";
import { OrchardTaprootAssetsInfo } from "./tapinfo.model";

@Resolver()
export class TaprootAssetsInfoResolver {

	private readonly logger = new Logger(TaprootAssetsInfoResolver.name);

	constructor(
		private taprootAssetsInfoService: TaprootAssetsInfoService,
	) {}

	@Query(() => OrchardTaprootAssetsInfo)
	@UseGuards(GqlAuthGuard)
	async taproot_assets_info() : Promise<OrchardTaprootAssetsInfo> {
		const tag = 'GET { taproot_assets_info }';
		this.logger.debug(tag);
		return await this.taprootAssetsInfoService.getTaprootAssetsInfo(tag);
	}
}