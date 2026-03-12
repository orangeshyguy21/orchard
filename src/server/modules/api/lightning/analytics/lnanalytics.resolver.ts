/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {Timezone, TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
import {AnalyticsInterval} from '@server/modules/analytics/analytics.enums';
/* Native Dependencies */
import {LightningAnalyticsMetric} from '@server/modules/lightning/analytics/lnanalytics.enums';
/* Local Dependencies */
import {OrchardLightningAnalytics, OrchardLightningAnalyticsMetric, OrchardLightningAnalyticsBackfillStatus} from './lnanalytics.model';
import {ApiLightningAnalyticsService} from './lnanalytics.service';

@Resolver()
export class LightningAnalyticsResolver {
	private readonly logger = new Logger(LightningAnalyticsResolver.name);

	constructor(private apiLightningAnalyticsService: ApiLightningAnalyticsService) {}

	/* *******************************************************
		Analytics Queries
	******************************************************** */

	@Query(() => [OrchardLightningAnalytics])
	async lightning_analytics_local_balance(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardLightningAnalytics[]> {
		const tag = 'GET { lightning_analytics_local_balance }';
		this.logger.debug(tag);
		return await this.apiLightningAnalyticsService.getAnalyticsLocalBalance(tag, {date_start, date_end, interval, timezone});
	}

	@Query(() => [OrchardLightningAnalytics])
	async lightning_analytics_remote_balance(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardLightningAnalytics[]> {
		const tag = 'GET { lightning_analytics_remote_balance }';
		this.logger.debug(tag);
		return await this.apiLightningAnalyticsService.getAnalyticsRemoteBalance(tag, {date_start, date_end, interval, timezone});
	}

	@Query(() => [OrchardLightningAnalyticsMetric])
	async lightning_analytics_metrics(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
		@Args('metrics', {type: () => [LightningAnalyticsMetric], nullable: true}) metrics?: LightningAnalyticsMetric[],
	): Promise<OrchardLightningAnalyticsMetric[]> {
		const tag = 'GET { lightning_analytics_metrics }';
		this.logger.debug(tag);
		return await this.apiLightningAnalyticsService.getAnalyticsMetrics(tag, {date_start, date_end, interval, timezone, metrics});
	}

	/* *******************************************************
		Backfill Status
	******************************************************** */

	@Query(() => OrchardLightningAnalyticsBackfillStatus)
	lightning_analytics_backfill_status(): OrchardLightningAnalyticsBackfillStatus {
		const tag = 'GET { lightning_analytics_backfill_status }';
		this.logger.debug(tag);
		return this.apiLightningAnalyticsService.getBackfillStatus(tag);
	}
}
