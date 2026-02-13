/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query} from '@nestjs/graphql';
/* Local Dependencies */
import {LightningChannelService} from './lnchannel.service';
import {OrchardLightningChannel, OrchardLightningClosedChannel} from './lnchannel.model';

@Resolver()
export class LightningChannelResolver {
	private readonly logger = new Logger(LightningChannelResolver.name);

	constructor(private lightningChannelService: LightningChannelService) {}

	@Query(() => [OrchardLightningChannel])
	async lightning_channels(): Promise<OrchardLightningChannel[]> {
		const tag = 'GET { lightning_channels }';
		this.logger.debug(tag);
		return await this.lightningChannelService.getLightningChannels(tag);
	}

	@Query(() => [OrchardLightningClosedChannel])
	async lightning_closed_channels(): Promise<OrchardLightningClosedChannel[]> {
		const tag = 'GET { lightning_closed_channels }';
		this.logger.debug(tag);
		return await this.lightningChannelService.getLightningClosedChannels(tag);
	}
}
