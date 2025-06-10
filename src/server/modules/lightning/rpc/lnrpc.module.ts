/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { FetchModule } from '@server/modules/fetch/fetch.module';
import { LndModule } from '@server/modules/lightning/lnd/lnd.module';
/* Local Dependencies */
import { LightningRpcService } from './lnrpc.service';

@Module({
	imports: [
		FetchModule,
		LndModule,
	],
	providers: [
		LightningRpcService,
	],
	exports: [
		LightningRpcService
	],
})
export class LightningRpcModule {}
