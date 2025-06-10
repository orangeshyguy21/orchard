/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { FetchModule } from '@server/modules/fetch/fetch.module';
import { LndModule } from '@server/modules/lightning/lnd/lnd.module';
/* Local Dependencies */
import { LightningService } from './lightning.service';

@Module({
	imports: [
		FetchModule,
		LndModule,
	],
	providers: [
		LightningService,
	],
	exports: [
		LightningService
	],
})
export class LightningModule {}
