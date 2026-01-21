/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Native Dependencies */
import {LightningAnalyticsService} from '@server/modules/lightning/analytics/lnanalytics.service';
import {LightningAnalytics} from '@server/modules/lightning/analytics/lnanalytics.entity';
import {LightningAnalyticsMetric, LightningAnalyticsInterval} from '@server/modules/lightning/analytics/lnanalytics.enums';
import {LightningAnalyticsArgs} from '@server/modules/lightning/analytics/lnanalytics.interfaces';
/* Local Dependencies */
import {OrchardLightningAnalytics, OrchardLightningAnalyticsBackfillStatus} from './lnanalytics.model';

@Injectable()
export class ApiLightningAnalyticsService {
	private readonly logger = new Logger(ApiLightningAnalyticsService.name);

	constructor(private lightningAnalyticsService: LightningAnalyticsService) {}

	/**
	 * Gets analytics data, combining cached data with live data for current period
	 */
	async getAnalytics(tag: string, args: LightningAnalyticsArgs): Promise<OrchardLightningAnalytics[]> {
		this.logger.debug(tag);

		const now = Math.floor(Date.now() / 1000);
		const current_hour_start = this.lightningAnalyticsService.getHourStart(now);

		const date_start = args.date_start ?? 0;
		const date_end = args.date_end ?? now;
		const metrics = args.metrics ?? Object.values(LightningAnalyticsMetric);

		// Get cached data
		const cached = await this.lightningAnalyticsService.getCachedAnalytics(
			date_start,
			Math.min(date_end, current_hour_start - 1),
			metrics,
		);

		// If requesting current hour, compute live
		let live: LightningAnalytics[] = [];
		if (date_end >= current_hour_start) {
			live = await this.lightningAnalyticsService.computeAndBuildEntities(current_hour_start);
		}

		const all_data = [...cached, ...live].filter((d) => metrics.includes(d.metric as LightningAnalyticsMetric));

		return this.aggregateByInterval(all_data, args.interval ?? LightningAnalyticsInterval.hour, args.timezone);
	}

	/**
	 * Gets the current backfill status
	 */
	getBackfillStatus(tag: string): OrchardLightningAnalyticsBackfillStatus {
		this.logger.debug(tag);
		const status = this.lightningAnalyticsService.getBackfillStatus();
		return status as OrchardLightningAnalyticsBackfillStatus;
	}

	private aggregateByInterval(
		data: LightningAnalytics[],
		interval: LightningAnalyticsInterval,
		timezone?: string,
	): OrchardLightningAnalytics[] {
		if (interval === LightningAnalyticsInterval.hour) {
			return data.map((d) => new OrchardLightningAnalytics(d.metric as LightningAnalyticsMetric, d.amount_msat, d.date));
		}

		const tz = timezone ?? 'UTC';
		const buckets = new Map<string, {metric: LightningAnalyticsMetric; amount_msat: bigint; date: number}>();

		for (const d of data) {
			const dt = DateTime.fromSeconds(d.date, {zone: tz});
			let bucket_start: DateTime;

			switch (interval) {
				case LightningAnalyticsInterval.day:
					bucket_start = dt.startOf('day');
					break;
				case LightningAnalyticsInterval.week:
					bucket_start = dt.startOf('week');
					break;
				case LightningAnalyticsInterval.month:
					bucket_start = dt.startOf('month');
					break;
				default:
					bucket_start = dt.startOf('hour');
			}

			const key = `${d.metric}:${bucket_start.toSeconds()}`;
			const existing = buckets.get(key);

			if (existing) {
				existing.amount_msat += BigInt(d.amount_msat);
			} else {
				buckets.set(key, {
					metric: d.metric as LightningAnalyticsMetric,
					amount_msat: BigInt(d.amount_msat),
					date: bucket_start.toSeconds(),
				});
			}
		}

		return Array.from(buckets.values())
			.sort((a, b) => a.date - b.date)
			.map((b) => new OrchardLightningAnalytics(b.metric, b.amount_msat.toString(), b.date));
	}
}
