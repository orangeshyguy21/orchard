/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {LightningModule} from '@server/modules/lightning/lightning/lightning.module';
/* Local Dependencies */
import {LightningAnalyticsResolver} from './lnanalytics.resolver';
import {LightningAnalyticsService} from './lnanalytics.service';

@Module({
	imports: [ErrorModule, LightningModule],
	providers: [LightningAnalyticsResolver, LightningAnalyticsService],
})
export class LightningAnalyticsModule {}
