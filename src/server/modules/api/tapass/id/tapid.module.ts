/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
/* Local Dependencies */
import { TaprootAssetsIdService } from "./tapid.service";
import { TaprootAssetsIdResolver } from "./tapid.resolver";

@Module({
	imports: [
		ErrorModule,
	],
	providers: [
		TaprootAssetsIdService,
		TaprootAssetsIdResolver,
	]
})
export class TaprootAssetsIdModule {}