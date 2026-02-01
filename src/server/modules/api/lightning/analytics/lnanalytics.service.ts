/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {UTXOracle} from '@server/modules/bitcoin/utxoracle/utxoracle.entity';
import {findNearestOraclePrice, oracleConvertToUSDCents} from '@server/modules/bitcoin/utxoracle/utxoracle.helpers';
/* Native Dependencies */
import {BitcoinUTXOracleService} from '@server/modules/bitcoin/utxoracle/utxoracle.service';
import {LightningAnalyticsService} from '@server/modules/lightning/analytics/lnanalytics.service';
import {LightningAnalytics} from '@server/modules/lightning/analytics/lnanalytics.entity';
import {LightningAnalyticsMetric, LightningAnalyticsInterval} from '@server/modules/lightning/analytics/lnanalytics.enums';
import {LightningAnalyticsArgs} from '@server/modules/lightning/analytics/lnanalytics.interfaces';
/* Local Dependencies */
import {OrchardLightningAnalytics, OrchardLightningAnalyticsBackfillStatus} from './lnanalytics.model';

@Injectable()
export class ApiLightningAnalyticsService {
	private readonly logger = new Logger(ApiLightningAnalyticsService.name);

	constructor(
        private bitcoinUTXOracleService: BitcoinUTXOracleService,
        private lightningAnalyticsService: LightningAnalyticsService,
    ) {}

	/**
	 * Gets analytics data
	 */
	async getAnalytics(tag: string, args: LightningAnalyticsArgs): Promise<OrchardLightningAnalytics[]> {
		this.logger.debug(tag);
		const now = DateTime.utc().toSeconds();
		const current_hour_start = DateTime.fromSeconds(now, {zone: 'UTC'}).startOf('hour').toSeconds();
        const interval = args.interval ?? LightningAnalyticsInterval.hour;
		const date_start = args.date_start ?? 0;
		const date_end = args.date_end ?? now;
		const metrics = args.metrics ?? Object.values(LightningAnalyticsMetric);
		const cached = await this.lightningAnalyticsService.getCachedAnalytics(
			date_start,
			Math.min(date_end, current_hour_start - 1),
			metrics,
		);
		const all_data = cached.filter((d) => metrics.includes(d.metric as LightningAnalyticsMetric) && d.amount !== '0');
        const utx_oracle_map = await this.bitcoinUTXOracleService.getOraclePriceMap();
		return this.aggregateByInterval(all_data, interval, utx_oracle_map, args.timezone, date_start);
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
        utx_oracle_map: Map<number, UTXOracle>,
		timezone?: string,
		date_start?: number,
	): OrchardLightningAnalytics[] {
		if (interval === LightningAnalyticsInterval.hour) {
			return data.map((d) => {
                const nearest_price = findNearestOraclePrice(utx_oracle_map, d.date);
                const amount_oracle = oracleConvertToUSDCents(Number(d.amount), nearest_price?.price, d.unit);
                return new OrchardLightningAnalytics(d.unit, d.metric as LightningAnalyticsMetric, d.amount, d.date, amount_oracle);
            });
		}

		const tz = timezone ?? 'UTC';
		type Bucket = {unit: string; metric: LightningAnalyticsMetric; amount: bigint; date: number};

		const buckets = data.reduce((acc, d) => {
			const bucket_date = this.getBucketDate(d.date, interval, tz, date_start, data);
			const key = interval === LightningAnalyticsInterval.custom ? `${d.unit}:${d.metric}` : `${d.unit}:${d.metric}:${bucket_date}`;
			const existing = acc.get(key);

			if (existing) {
				existing.amount += BigInt(d.amount);
			} else {
				acc.set(key, {unit: d.unit, metric: d.metric as LightningAnalyticsMetric, amount: BigInt(d.amount), date: bucket_date});
			}
			return acc;
		}, new Map<string, Bucket>());

		return Array.from(buckets.values())
			.sort((a, b) => a.date - b.date)
			.map((b) => {
                const nearest_price = findNearestOraclePrice(utx_oracle_map, b.date);
                const amount_oracle = oracleConvertToUSDCents(Number(b.amount), nearest_price?.price, b.unit);
                return new OrchardLightningAnalytics(b.unit, b.metric, b.amount.toString(), b.date, amount_oracle);
            });
	}

	private getBucketDate(
		date: number,
		interval: LightningAnalyticsInterval,
		timezone: string,
		date_start?: number,
		data?: LightningAnalytics[],
	): number {
		if (interval === LightningAnalyticsInterval.custom) {
			return date_start ?? (data?.length ? Math.min(...data.map((d) => d.date)) : 0);
		}

		const dt = DateTime.fromSeconds(date, {zone: timezone});

		switch (interval) {
			case LightningAnalyticsInterval.day:
				return dt.startOf('day').toSeconds();
			case LightningAnalyticsInterval.week:
				return dt.startOf('week').toSeconds();
			case LightningAnalyticsInterval.month:
				return dt.startOf('month').toSeconds();
			default:
				return dt.startOf('hour').toSeconds();
		}
	}
}
