/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query} from '@nestjs/graphql';
/* Local Dependencies */
import {TaprootAssetsIdService} from './tapid.service';
import {OrchardTaprootAssetsId} from './tapid.model';

@Resolver()
export class TaprootAssetsIdResolver {
	private readonly logger = new Logger(TaprootAssetsIdResolver.name);

	constructor(private taprootAssetsIdService: TaprootAssetsIdService) {}

	@Query(() => [OrchardTaprootAssetsId])
	async taproot_assets_ids(): Promise<OrchardTaprootAssetsId[]> {
		const tag = 'GET { taproot_assets_ids }';
		this.logger.debug(tag);
		return await this.taprootAssetsIdService.getTaprootAssetsIds(tag);
	}
}
