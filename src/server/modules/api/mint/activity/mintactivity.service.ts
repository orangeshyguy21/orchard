/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintMintQuote, CashuMintMeltQuote, CashuMintSwap} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {MintActivityPeriod} from '@server/modules/cashu/mintdb/cashumintdb.enums';
import {MintQuoteState, MeltQuoteState} from '@server/modules/cashu/cashu.enums';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintActivitySummary, OrchardMintActivityBucket} from './mintactivity.model';

/** Row limit passed to each activity query — used to detect truncation */
const ACTIVITY_ROW_LIMIT = 500;

/** Maps period enum to duration in seconds */
const PERIOD_SECONDS: Record<MintActivityPeriod, number> = {
	[MintActivityPeriod.day]: 86400,
	[MintActivityPeriod.three_day]: 259200,
	[MintActivityPeriod.week]: 604800,
};

/** Maps period enum to sparkline bucket size in seconds */
const BUCKET_SECONDS: Record<MintActivityPeriod, number> = {
	[MintActivityPeriod.day]: 3600,
	[MintActivityPeriod.three_day]: 86400,
	[MintActivityPeriod.week]: 86400,
};

type QuoteStats = {
	count: number;
	volume: number;
	completed_pct: number;
	avg_time: number;
};

type SwapStats = {
	count: number;
	volume: number;
};

@Injectable()
export class MintActivityService {
	private readonly logger = new Logger(MintActivityService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	/**
	 * Fetches raw quotes/swaps for two consecutive periods and computes
	 * all activity summary metrics in application code.
	 */
	public async getMintActivitySummary(tag: string, period: MintActivityPeriod, timezone?: string): Promise<OrchardMintActivitySummary> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const now = Math.floor(Date.now() / 1000);
				const period_seconds = PERIOD_SECONDS[period];
				const current_start = now - period_seconds;
				const prior_start = now - period_seconds * 2;

				const query_args = {page_size: ACTIVITY_ROW_LIMIT};
				const [current_mints, prior_mints, current_melts, prior_melts, current_swaps, prior_swaps] = await Promise.all([
					this.cashuMintDatabaseService.getMintMintQuotes(client, {date_start: current_start, date_end: now, ...query_args}),
					this.cashuMintDatabaseService.getMintMintQuotes(client, {date_start: prior_start, date_end: current_start, ...query_args}),
					this.cashuMintDatabaseService.getMintMeltQuotes(client, {date_start: current_start, date_end: now, ...query_args}),
					this.cashuMintDatabaseService.getMintMeltQuotes(client, {date_start: prior_start, date_end: current_start, ...query_args}),
					this.cashuMintDatabaseService.getMintSwaps(client, {date_start: current_start, date_end: now, ...query_args}),
					this.cashuMintDatabaseService.getMintSwaps(client, {date_start: prior_start, date_end: current_start, ...query_args}),
				]);

				const warnings: string[] = [];
				if (current_mints.length >= ACTIVITY_ROW_LIMIT) warnings.push('Mint quote data may be incomplete due to high volume');
				if (current_melts.length >= ACTIVITY_ROW_LIMIT) warnings.push('Melt quote data may be incomplete due to high volume');
				if (current_swaps.length >= ACTIVITY_ROW_LIMIT) warnings.push('Swap data may be incomplete due to high volume');

				return this.buildSummary(
					{mints: current_mints, melts: current_melts, swaps: current_swaps},
					{mints: prior_mints, melts: prior_melts, swaps: prior_swaps},
					current_start,
					now,
					period,
					timezone || 'UTC',
					warnings,
				);
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	/** Assembles the full activity summary from current and prior period data */
	private buildSummary(
		current: {mints: CashuMintMintQuote[]; melts: CashuMintMeltQuote[]; swaps: CashuMintSwap[]},
		prior: {mints: CashuMintMintQuote[]; melts: CashuMintMeltQuote[]; swaps: CashuMintSwap[]},
		period_start: number,
		period_end: number,
		period: MintActivityPeriod,
		timezone: string,
		warnings: string[],
	): OrchardMintActivitySummary {
		const cur_mint = this.computeMintQuoteStats(current.mints);
		const pri_mint = this.computeMintQuoteStats(prior.mints);
		const cur_melt = this.computeMeltQuoteStats(current.melts);
		const pri_melt = this.computeMeltQuoteStats(prior.melts);
		const cur_swap = this.computeSwapStats(current.swaps);
		const pri_swap = this.computeSwapStats(prior.swaps);

		const bucket_seconds = BUCKET_SECONDS[period];

		const summary = new OrchardMintActivitySummary();

		summary.total_operations = cur_mint.count + cur_melt.count + cur_swap.count;
		summary.total_operations_delta = this.computeDelta(summary.total_operations, pri_mint.count + pri_melt.count + pri_swap.count);

		summary.total_volume = cur_mint.volume + cur_melt.volume + cur_swap.volume;
		summary.total_volume_delta = this.computeDelta(summary.total_volume, pri_mint.volume + pri_melt.volume + pri_swap.volume);

		summary.mint_count = cur_mint.count;
		summary.mint_count_delta = this.computeDelta(cur_mint.count, pri_mint.count);
		summary.mint_sparkline = this.buildSparkline(
			current.mints,
			period_start,
			period_end,
			bucket_seconds,
			timezone,
			(q) => q.amount_issued,
		);

		summary.melt_count = cur_melt.count;
		summary.melt_count_delta = this.computeDelta(cur_melt.count, pri_melt.count);
		summary.melt_sparkline = this.buildSparkline(current.melts, period_start, period_end, bucket_seconds, timezone, (q) =>
			q.state === MeltQuoteState.PAID ? q.amount : 0,
		);

		summary.swap_count = cur_swap.count;
		summary.swap_count_delta = this.computeDelta(cur_swap.count, pri_swap.count);
		summary.swap_sparkline = this.buildSparkline(current.swaps, period_start, period_end, bucket_seconds, timezone, (q) => q.amount);

		summary.mint_completed_pct = cur_mint.completed_pct;
		summary.mint_completed_pct_delta = this.computeDelta(cur_mint.completed_pct, pri_mint.completed_pct);
		summary.mint_avg_time = cur_mint.avg_time;
		summary.mint_avg_time_delta = this.computeDelta(cur_mint.avg_time, pri_mint.avg_time);

		summary.melt_completed_pct = cur_melt.completed_pct;
		summary.melt_completed_pct_delta = this.computeDelta(cur_melt.completed_pct, pri_melt.completed_pct);
		summary.melt_avg_time = cur_melt.avg_time;
		summary.melt_avg_time_delta = this.computeDelta(cur_melt.avg_time, pri_melt.avg_time);

		summary.warnings = warnings;

		return summary;
	}

	/** Computes count, volume, completion %, and avg time for mint quotes */
	private computeMintQuoteStats(quotes: CashuMintMintQuote[]): QuoteStats {
		if (quotes.length === 0) return {count: 0, volume: 0, completed_pct: 0, avg_time: 0};

		const issued = quotes.filter((q) => q.state === MintQuoteState.ISSUED);
		const volume = issued.reduce((sum, q) => sum + q.amount_issued, 0);

		const durations = issued
			.filter((q) => q.issued_time != null)
			.map((q) => q.issued_time! - q.created_time)
			.filter((d) => d >= 0);

		const avg_time = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;

		return {
			count: quotes.length,
			volume,
			completed_pct: (issued.length / quotes.length) * 100,
			avg_time,
		};
	}

	/** Computes count, volume, completion %, and avg time for melt quotes */
	private computeMeltQuoteStats(quotes: CashuMintMeltQuote[]): QuoteStats {
		if (quotes.length === 0) return {count: 0, volume: 0, completed_pct: 0, avg_time: 0};

		const paid = quotes.filter((q) => q.state === MeltQuoteState.PAID);
		const volume = paid.reduce((sum, q) => sum + q.amount, 0);

		const durations = paid
			.filter((q) => q.paid_time != null)
			.map((q) => q.paid_time! - q.created_time)
			.filter((d) => d >= 0);

		const avg_time = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;

		return {
			count: quotes.length,
			volume,
			completed_pct: (paid.length / quotes.length) * 100,
			avg_time,
		};
	}

	/** Computes count and volume for swaps */
	private computeSwapStats(swaps: CashuMintSwap[]): SwapStats {
		return {
			count: swaps.length,
			volume: swaps.reduce((sum, s) => sum + s.amount, 0),
		};
	}

	/** Computes percentage delta between current and prior values */
	private computeDelta(current: number, prior: number): number {
		if (prior === 0) return current > 0 ? 100 : 0;
		return ((current - prior) / prior) * 100;
	}

	/** Groups records into time buckets for sparkline rendering */
	private buildSparkline<T extends {created_time: number}>(
		records: T[],
		period_start: number,
		period_end: number,
		bucket_seconds: number,
		timezone: string,
		amount_fn: (record: T) => number,
	): OrchardMintActivityBucket[] {
		const tz_offset = DateTime.now().setZone(timezone).offset * 60;
		const adjusted_start = period_start + tz_offset;
		const bucket_start = Math.floor(adjusted_start / bucket_seconds) * bucket_seconds - tz_offset;
		const bucket_count = Math.ceil((period_end - bucket_start) / bucket_seconds);

		const buckets = new Map<number, number>();
		for (let i = 0; i < bucket_count; i++) {
			buckets.set(bucket_start + i * bucket_seconds, 0);
		}

		records.forEach((record) => {
			const adjusted = record.created_time + tz_offset;
			const key = Math.floor(adjusted / bucket_seconds) * bucket_seconds - tz_offset;
			buckets.set(key, (buckets.get(key) ?? 0) + amount_fn(record));
		});

		return Array.from(buckets.entries())
			.sort(([a], [b]) => a - b)
			.map(([created_time, amount]) => {
				const bucket = new OrchardMintActivityBucket();
				bucket.created_time = created_time;
				bucket.amount = amount;
				return bucket;
			});
	}
}
