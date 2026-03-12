/* Core Dependencies */
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
/* Local Dependencies */
import {SystemMetrics} from './sysmetrics.entity';
import {SystemMetricsService} from './sysmetrics.service';

@Module({
	imports: [TypeOrmModule.forFeature([SystemMetrics])],
	providers: [SystemMetricsService],
	exports: [SystemMetricsService],
})
export class SystemMetricsModule {}
