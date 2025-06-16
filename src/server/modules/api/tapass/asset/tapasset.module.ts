/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { TaprootAssetsModule } from "@server/modules/tapass/tapass/tapass.module";
/* Local Dependencies */
import { TaprootAssetsAssetService } from "./tapasset.service";
import { TaprootAssetsAssetResolver } from "./tapasset.resolver";

@Module({
	imports: [
		TaprootAssetsModule,
		ErrorModule,
	],
	providers: [
		TaprootAssetsAssetService,
		TaprootAssetsAssetResolver,
	]
})
export class TaprootAssetsAssetModule {}
