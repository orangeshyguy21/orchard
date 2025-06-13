/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
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
	async taproot_assets_info() : Promise<OrchardTaprootAssetsInfo> {
		const tag = 'GET { taproot_assets_info }';
		this.logger.debug(tag);
		return await this.taprootAssetsInfoService.getTaprootAssetsInfo(tag);
	}
}