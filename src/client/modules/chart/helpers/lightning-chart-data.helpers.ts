/* Application Dependencies */
import {LightningAnalytic} from '@client/modules/lightning/classes/lightning-analytic.class';
/* Vendor Dependencies */
import {DateTime, DateTimeUnit} from 'luxon';
/* Shared Dependencies */
import {LightningAnalyticsMetric, LightningAnalyticsInterval} from '@shared/generated.types';

type LightningAnalyticsGroup = Record<number, LightningAnalytic[]>;

/**
 * Groups lightning analytics by timestamp
 */
export function groupLightningAnalyticsByTimestamp(analytics: LightningAnalytic[]): LightningAnalyticsGroup {
	return analytics.reduce((groups, analytic) => {
		const timestamp = analytic.date;
		groups[timestamp] = groups[timestamp] || [];
		groups[timestamp].push(analytic);
		return groups;
	}, {} as LightningAnalyticsGroup);
}

/**
 * Calculates cumulative outbound liquidity at a given timestamp from lightning metrics.
 * Sign convention:
 * - invoices_in: positive (increases outbound)
 * - forward_fees: positive (increases outbound)
 * - channel_opens: positive (initial local allocation)
 * - payments_out: negative (reduces outbound)
 * - channel_closes: negative (removes channel liquidity)
 */
export function calculateOutboundLiquidity(analytics: LightningAnalytic[]): number {
	return analytics.reduce((sum, analytic) => {
		const amount_msat = parseFloat(analytic.amount) || 0;
		switch (analytic.metric) {
			case LightningAnalyticsMetric.InvoicesIn:
			case LightningAnalyticsMetric.ForwardFees:
			case LightningAnalyticsMetric.ChannelOpens:
				return sum + amount_msat;
			case LightningAnalyticsMetric.PaymentsOut:
			case LightningAnalyticsMetric.ChannelCloses:
				return sum - amount_msat;
			default:
				return sum;
		}
	}, 0);
}

/**
 * Converts msat to sat (divides by 1000)
 */
export function msatToSat(msat: number): number {
	return Math.floor(msat / 1000);
}

/**
 * Creates cumulative outbound liquidity data points for charting.
 * Filters to only msat unit for sat calculations.
 * Returns array of {x: timestamp_ms, y: sat_amount} sorted by timestamp.
 */
export function getOutboundLiquidityData(
	unique_timestamps: number[],
	analytics: LightningAnalytic[],
	initial_outbound_msat: number = 0,
): {x: number; y: number}[] {
	// Filter to only msat unit for sat liquidity
	const msat_analytics = analytics.filter((a) => a.unit === 'msat');
	const grouped = groupLightningAnalyticsByTimestamp(msat_analytics);
	let running_sum = initial_outbound_msat;

	return unique_timestamps.map((timestamp) => {
		const analytics_at_timestamp = grouped[timestamp] || [];
		const delta = calculateOutboundLiquidity(analytics_at_timestamp);
		running_sum = running_sum + delta;
		return {
			x: timestamp * 1000,
			y: msatToSat(running_sum),
		};
	});
}

/**
 * Creates raw (non-cumulative) outbound liquidity data points for volume charts.
 * Filters to only msat unit for sat calculations.
 * Returns array of {x: timestamp_ms, y: sat_amount} sorted by timestamp.
 */
export function getOutboundLiquidityVolumeData(unique_timestamps: number[], analytics: LightningAnalytic[]): {x: number; y: number}[] {
	// Filter to only msat unit for sat liquidity
	const msat_analytics = analytics.filter((a) => a.unit === 'msat');
	const grouped = groupLightningAnalyticsByTimestamp(msat_analytics);

	return unique_timestamps.map((timestamp) => {
		const analytics_at_timestamp = grouped[timestamp] || [];
		const delta = calculateOutboundLiquidity(analytics_at_timestamp);
		return {
			x: timestamp * 1000,
			y: msatToSat(delta),
		};
	});
}

/**
 * Gets the initial outbound liquidity from the pre-period analytics
 * Filters to only msat unit for sat calculations.
 */
export function getInitialOutboundMsat(analytics_pre: LightningAnalytic[]): number {
	const msat_analytics = analytics_pre.filter((a) => a.unit === 'msat');
	return calculateOutboundLiquidity(msat_analytics);
}

/**
 * Gets the time interval unit for a given lightning analytics interval
 */
export function getLightningTimeInterval(interval: LightningAnalyticsInterval): DateTimeUnit {
	if (!interval) return 'day';
	if (interval === LightningAnalyticsInterval.Week) return 'week';
	if (interval === LightningAnalyticsInterval.Month) return 'month';
	if (interval === LightningAnalyticsInterval.Hour) return 'hour';
	return 'day';
}

/**
 * Gets all possible timestamps between start and end for the given interval
 */
export function getLightningTimestamps(first_timestamp: number, last_timestamp: number, interval: LightningAnalyticsInterval): number[] {
	const all_timestamps: number[] = [];
	const time_unit = getLightningTimeInterval(interval);
	let current_time = DateTime.fromSeconds(first_timestamp).startOf(time_unit).toSeconds();

	while (current_time <= last_timestamp) {
		all_timestamps.push(current_time);
		current_time = getNextLightningTimestamp(current_time, interval);
	}

	const last_valid = DateTime.fromSeconds(last_timestamp).startOf(time_unit).toSeconds();
	if (!all_timestamps.includes(last_valid)) {
		all_timestamps.push(last_valid);
	}

	return all_timestamps;
}

/**
 * Gets the next timestamp based on interval
 */
function getNextLightningTimestamp(timestamp: number, interval: LightningAnalyticsInterval): number {
	if (interval === LightningAnalyticsInterval.Hour) return DateTime.fromSeconds(timestamp).plus({hours: 1}).toSeconds();
	if (interval === LightningAnalyticsInterval.Day) return DateTime.fromSeconds(timestamp).plus({days: 1}).toSeconds();
	if (interval === LightningAnalyticsInterval.Week) return DateTime.fromSeconds(timestamp).plus({weeks: 1}).toSeconds();
	if (interval === LightningAnalyticsInterval.Month) return DateTime.fromSeconds(timestamp).plus({months: 1}).toSeconds();
	return DateTime.fromSeconds(timestamp).plus({days: 1}).toSeconds();
}

/**
 * Corrects the last data point with the real-time lightning balance if it's at the current period start.
 * The analytics data for the current period may be incomplete, so we use the live balance instead.
 */
export function correctLastPointWithLiveBalance(
	data: {x: number; y: number}[],
	live_balance_sat: number | null,
	interval: LightningAnalyticsInterval,
): {x: number; y: number}[] {
	if (data.length === 0 || live_balance_sat === null) return data;
	const last_point = data[data.length - 1];
	const last_timestamp_sec = last_point.x / 1000;
	const time_unit = getLightningTimeInterval(interval);
	const current_period_start = DateTime.now().startOf(time_unit).toSeconds();
	if (last_timestamp_sec !== current_period_start) return data;
	return [...data.slice(0, -1), {x: last_point.x, y: live_balance_sat}];
}
