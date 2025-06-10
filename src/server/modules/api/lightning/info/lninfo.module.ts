/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { LightningModule } from "@server/modules/lightning/lightning/lightning.module";
/* Local Dependencies */
import { LightningInfoService } from "./lninfo.service";
import { LightningInfoResolver } from "./lninfo.resolver";

@Module({
	imports: [
		LightningModule,
		ErrorModule,
	],
	providers: [
		LightningInfoService,
		LightningInfoResolver,
	]
})
export class LightningInfoModule {}
