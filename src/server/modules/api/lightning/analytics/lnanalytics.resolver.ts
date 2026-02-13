/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {Timezone, TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
/* Native Dependencies */
import {LightningAnalyticsInterval, LightningAnalyticsMetric} from '@server/modules/lightning/analytics/lnanalytics.enums';
/* Local Dependencies */
import {OrchardLightningAnalytics, OrchardLightningAnalyticsBackfillStatus} from './lnanalytics.model';
import {ApiLightningAnalyticsService} from './lnanalytics.service';

@Resolver()
export class LightningAnalyticsResolver {
	private readonly logger = new Logger(LightningAnalyticsResolver.name);

	constructor(private apiLightningAnalyticsService: ApiLightningAnalyticsService) {}

	@Query(() => [OrchardLightningAnalytics])
	async lightning_analytics(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => LightningAnalyticsInterval, nullable: true}) interval?: LightningAnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
		@Args('metrics', {type: () => [LightningAnalyticsMetric], nullable: true}) metrics?: LightningAnalyticsMetric[],
	): Promise<OrchardLightningAnalytics[]> {
		const tag = 'GET { lightning_analytics }';
		this.logger.debug(tag);
		return await this.apiLightningAnalyticsService.getAnalytics(tag, {date_start, date_end, interval, timezone, metrics});
	}

	@Query(() => OrchardLightningAnalyticsBackfillStatus)
	lightning_analytics_backfill_status(): OrchardLightningAnalyticsBackfillStatus {
		const tag = 'GET { lightning_analytics_backfill_status }';
		this.logger.debug(tag);
		return this.apiLightningAnalyticsService.getBackfillStatus(tag);
	}
}
