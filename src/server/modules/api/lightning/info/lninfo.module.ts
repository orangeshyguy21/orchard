/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { LightningRpcModule } from "@server/modules/lightning/rpc/lnrpc.module";
/* Local Dependencies */
import { LightningInfoService } from "./lninfo.service";
import { LightningInfoResolver } from "./lninfo.resolver";

@Module({
	imports: [
		LightningRpcModule,
		ErrorModule,
	],
	providers: [
		LightningInfoService,
		LightningInfoResolver,
	]
})
export class LightningInfoModule {}
