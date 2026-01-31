/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {BitcoinUTXOracleModule} from '@server/modules/bitcoin/utxoracle/utxoracle.module';
/* Native Dependencies */
import {LightningAnalyticsModule} from '@server/modules/lightning/analytics/lnanalytics.module';
/* Local Dependencies */
import {LightningAnalyticsResolver} from './lnanalytics.resolver';
import {ApiLightningAnalyticsService} from './lnanalytics.service';

@Module({
	imports: [BitcoinUTXOracleModule, LightningAnalyticsModule],
	providers: [LightningAnalyticsResolver, ApiLightningAnalyticsService],
})
export class ApiLightningAnalyticsModule {}
