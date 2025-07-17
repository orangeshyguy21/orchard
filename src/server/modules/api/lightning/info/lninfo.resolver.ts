/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query} from '@nestjs/graphql';
/* Local Dependencies */
import {LightningInfoService} from './lninfo.service';
import {OrchardLightningInfo} from './lninfo.model';

@Resolver()
export class LightningInfoResolver {
	private readonly logger = new Logger(LightningInfoResolver.name);

	constructor(private lightningInfoService: LightningInfoService) {}

	@Query(() => OrchardLightningInfo)
	async lightning_info(): Promise<OrchardLightningInfo> {
		const tag = 'GET { lightning_info }';
		this.logger.debug(tag);
		return await this.lightningInfoService.getLightningInfo(tag);
	}
}
