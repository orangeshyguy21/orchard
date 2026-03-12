/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {Timezone, TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
import {AnalyticsInterval} from '@server/modules/analytics/analytics.enums';
/* Native Dependencies */
import {BitcoinAnalyticsMetric} from '@server/modules/bitcoin/analytics/btcanalytics.enums';
/* Local Dependencies */
import {OrchardBitcoinAnalytics, OrchardBitcoinAnalyticsMetric, OrchardBitcoinAnalyticsBackfillStatus} from './btcanalytics.model';
import {ApiBitcoinAnalyticsService} from './btcanalytics.service';

@Resolver()
export class BitcoinAnalyticsResolver {
	private readonly logger = new Logger(BitcoinAnalyticsResolver.name);

	constructor(private apiBitcoinAnalyticsService: ApiBitcoinAnalyticsService) {}

	/* *******************************************************
		Analytics Queries
	******************************************************** */

	@Query(() => [OrchardBitcoinAnalytics])
	async bitcoin_analytics_balance(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardBitcoinAnalytics[]> {
		const tag = 'GET { bitcoin_analytics_balance }';
		this.logger.debug(tag);
		return await this.apiBitcoinAnalyticsService.getAnalyticsBalance(tag, {date_start, date_end, interval, timezone});
	}

	@Query(() => [OrchardBitcoinAnalyticsMetric])
	async bitcoin_analytics_metrics(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
		@Args('metrics', {type: () => [BitcoinAnalyticsMetric], nullable: true}) metrics?: BitcoinAnalyticsMetric[],
	): Promise<OrchardBitcoinAnalyticsMetric[]> {
		const tag = 'GET { bitcoin_analytics_metrics }';
		this.logger.debug(tag);
		return await this.apiBitcoinAnalyticsService.getAnalyticsMetrics(tag, {date_start, date_end, interval, timezone, metrics});
	}

	/* *******************************************************
		Backfill Status
	******************************************************** */

	@Query(() => OrchardBitcoinAnalyticsBackfillStatus)
	bitcoin_analytics_backfill_status(): OrchardBitcoinAnalyticsBackfillStatus {
		const tag = 'GET { bitcoin_analytics_backfill_status }';
		this.logger.debug(tag);
		return this.apiBitcoinAnalyticsService.getBackfillStatus(tag);
	}
}
