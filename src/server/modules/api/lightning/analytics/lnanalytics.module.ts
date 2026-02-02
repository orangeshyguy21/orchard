/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Native Dependencies */
import {LightningAnalyticsModule} from '@server/modules/lightning/analytics/lnanalytics.module';
/* Local Dependencies */
import {LightningAnalyticsResolver} from './lnanalytics.resolver';
import {ApiLightningAnalyticsService} from './lnanalytics.service';

@Module({
	imports: [LightningAnalyticsModule],
	providers: [LightningAnalyticsResolver, ApiLightningAnalyticsService],
})
export class ApiLightningAnalyticsModule {}
