/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { FetchModule } from '@server/modules/fetch/fetch.module';
import { LndModule } from '@server/modules/lightning/lnd/lnd.module';
import { TapdModule } from '@server/modules/lightning/tapd/tapd.module';
/* Local Dependencies */
import { LightningService } from './lightning.service';

@Module({
	imports: [
		FetchModule,
		LndModule,
		TapdModule,
	],
	providers: [
		LightningService,
	],
	exports: [
		LightningService
	],
})
export class LightningModule {}
