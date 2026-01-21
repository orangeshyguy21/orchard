/* Core Dependencies */
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
/* Application Dependencies */
import {LightningModule} from '@server/modules/lightning/lightning/lightning.module';
/* Local Dependencies */
import {LightningAnalytics} from './lnanalytics.entity';
import {LightningAnalyticsService} from './lnanalytics.service';

@Module({
	imports: [TypeOrmModule.forFeature([LightningAnalytics]), LightningModule],
	providers: [LightningAnalyticsService],
	exports: [LightningAnalyticsService],
})
export class LightningAnalyticsModule {}
