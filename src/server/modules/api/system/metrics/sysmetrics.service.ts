/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {ErrorService} from '@server/modules/error/error.service';
/* Native Dependencies */
import {SystemMetricsService} from '@server/modules/system/metrics/sysmetrics.service';
import {SystemMetrics} from '@server/modules/system/metrics/sysmetrics.entity';
import {SystemMetric, SystemMetricsInterval} from '@server/modules/system/metrics/sysmetrics.enums';
/* Local Dependencies */
import {OrchardSystemMetrics} from './sysmetrics.model';

/** Rounds a number to 2 decimal places */
const round2 = (n: number): number => Math.round(n * 100) / 100;

interface SystemMetricsArgs {
	date_start?: number;
	date_end?: number;
	interval?: SystemMetricsInterval;
	timezone?: string;
	metrics?: SystemMetric[];
}

@Injectable()
export class ApiSystemMetricsService {
	private readonly logger = new Logger(ApiSystemMetricsService.name);

	constructor(
		private systemMetricsService: SystemMetricsService,
		private errorService: ErrorService,
	) {}

	/**
	 * Gets system metrics data with optional interval aggregation
	 */
	async getMetrics(tag: string, args: SystemMetricsArgs): Promise<OrchardSystemMetrics[]> {
		try {
			const now = DateTime.utc().toUnixInteger();
			const interval = args.interval ?? SystemMetricsInterval.minute;
			const date_start = args.date_start ?? DateTime.utc().minus({days: 90}).toUnixInteger();
			const date_end = args.date_end ?? now;
			const metrics = args.metrics ?? Object.values(SystemMetric);

			const data = await this.systemMetricsService.getMetrics(date_start, date_end, metrics);

			return this.aggregateByInterval(data, interval, args.timezone);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.SystemMetricsError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	/**
	 * Aggregates raw metric data by the requested interval
	 */
	private aggregateByInterval(data: SystemMetrics[], interval: SystemMetricsInterval, timezone?: string): OrchardSystemMetrics[] {
		if (interval === SystemMetricsInterval.minute) {
			return data.map((d) => new OrchardSystemMetrics(d.metric as SystemMetric, d.value, d.date, d.value, d.value));
		}

		const tz = timezone ?? 'UTC';
		type Bucket = {metric: SystemMetric; values: number[]; min: number; max: number; date: number};

		const buckets = data.reduce((acc, d) => {
			const bucket_date = this.getBucketDate(d.date, interval, tz);
			const key = `${d.metric}:${bucket_date}`;
			const existing = acc.get(key);

			if (existing) {
				existing.values.push(d.value);
				existing.min = Math.min(existing.min, d.value);
				existing.max = Math.max(existing.max, d.value);
			} else {
				acc.set(key, {metric: d.metric as SystemMetric, values: [d.value], min: d.value, max: d.value, date: bucket_date});
			}
			return acc;
		}, new Map<string, Bucket>());

		return Array.from(buckets.values())
			.sort((a, b) => a.date - b.date)
			.map((b) => {
				const avg = b.values.reduce((sum, v) => sum + v, 0) / b.values.length;
				return new OrchardSystemMetrics(b.metric, round2(avg), b.date, round2(b.min), round2(b.max));
			});
	}

	/**
	 * Gets the bucket start timestamp for a given interval
	 */
	private getBucketDate(date: number, interval: SystemMetricsInterval, timezone: string): number {
		const dt = DateTime.fromSeconds(date, {zone: timezone});

		switch (interval) {
			case SystemMetricsInterval.day:
				return dt.startOf('day').toSeconds();
			case SystemMetricsInterval.hour:
				return dt.startOf('hour').toSeconds();
			default:
				return dt.startOf('minute').toSeconds();
		}
	}
}
