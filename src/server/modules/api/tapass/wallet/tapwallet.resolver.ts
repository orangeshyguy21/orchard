/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Local Dependencies */
import { TaprootAssetsWalletService } from "./tapwallet.service";
import { OrchardTaprootAssets, OrchardTaprootAssetsUtxo } from "./tapwallet.model";

@Resolver()
export class TaprootAssetsWalletResolver {

	private readonly logger = new Logger(TaprootAssetsWalletResolver.name);

	constructor(
		private taprootAssetsWalletService: TaprootAssetsWalletService,
	) {}

    @Query(() => OrchardTaprootAssets)
	async taproot_assets() : Promise<OrchardTaprootAssets> {
		const tag = 'GET { taproot_assets }';
		this.logger.debug(tag);
		return await this.taprootAssetsWalletService.getTaprootAssets(tag);
	}

	@Query(() => [OrchardTaprootAssetsUtxo])
	async taproot_assets_utxo() : Promise<OrchardTaprootAssetsUtxo[]> {
		const tag = 'GET { taproot_assets_utxo }';
		this.logger.debug(tag);
		return await this.taprootAssetsWalletService.getTaprootAssetsUtxo(tag);
	}
}