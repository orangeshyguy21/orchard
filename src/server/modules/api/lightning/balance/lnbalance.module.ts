/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { LightningRpcModule } from "@server/modules/lightning/rpc/lnrpc.module";
/* Local Dependencies */
import { LightningBalanceService } from './lnbalance.service';
import { LightningBalanceResolver } from './lnbalance.resolver';

@Module({
	imports: [
		LightningRpcModule,
		ErrorModule,
	],
	providers: [
		LightningBalanceService,
		LightningBalanceResolver,
	]
})
export class LightningBalanceModule {}