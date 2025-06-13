/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { TaprootAssetsModule } from "@server/modules/tapass/tapass/tapass.module";
/* Local Dependencies */
import { TaprootAssetsWalletService } from "./tapwallet.service";
import { TaprootAssetsWalletResolver } from "./tapwallet.resolver";

@Module({
	imports: [
		TaprootAssetsModule,
		ErrorModule,
	],
	providers: [
		TaprootAssetsWalletService,
		TaprootAssetsWalletResolver,
	]
})
export class TaprootAssetsWalletModule {}
