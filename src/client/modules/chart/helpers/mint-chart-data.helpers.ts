/* Application Dependencies */
import {MintAnalytic} from '@client/modules/mint/classes/mint-analytic.class';
import {LocalAmountPipe} from '@client/modules/local/pipes/local-amount/local-amount.pipe';
import {eligibleForOracleConversion, oracleConvertToUSDCents, findNearestOraclePrice} from '@client/modules/bitcoin/helpers/oracle.helpers';
/* Vendor Dependencies */
import {DateTime, DateTimeUnit} from 'luxon';
/* Native Dependencies */
import {OracleChartDataPoint} from '@client/modules/chart/types/chart.types';
/* Shared Dependencies */
import {AnalyticsInterval} from '@shared/generated.types';

type AnalyticsGroup = Record<string, MintAnalytic[]>;

export function groupAnalyticsByUnit(analytics: MintAnalytic[]): AnalyticsGroup {
	return analytics.reduce(
		(groups, analytic) => {
			const unit = analytic.unit;
			groups[unit] = groups[unit] || [];
			groups[unit].push(analytic);
			return groups;
		},
		{} as Record<string, MintAnalytic[]>,
	);
}

export function prependData(analytics: AnalyticsGroup, preceding_data: MintAnalytic[], timestamp_first: number): AnalyticsGroup {
	if (preceding_data.length === 0) return analytics;
	if (Object.keys(analytics).length === 0)
		return preceding_data.reduce(
			(groups, analytic) => {
				analytic.date = timestamp_first;
				groups[analytic.unit] = groups[analytic.unit] || [];
				groups[analytic.unit].push(analytic);
				return groups;
			},
			{} as Record<string, MintAnalytic[]>,
		);

	for (const preceding_item of preceding_data) {
		const unit = preceding_item.unit;
		preceding_item.date = timestamp_first;

		if (!analytics[unit]) {
			analytics[unit] = [preceding_item];
			continue;
		}

		const analytics_for_unit = analytics[unit];
		const matching_datapoint = analytics_for_unit.find((a) => a.date === preceding_item.date);
		if (!matching_datapoint) {
			analytics_for_unit.unshift(preceding_item);
		} else {
			matching_datapoint.amount = String(BigInt(matching_datapoint.amount) + BigInt(preceding_item.amount));
		}
	}
	return analytics;
}

export function getDataKeyedByTimestamp(analytics: MintAnalytic[], metric: string): Record<string, number> {
	return analytics.reduce(
		(acc, item) => {
			const value = item[metric as keyof MintAnalytic];
			acc[item.date] = typeof value === 'string' ? Number(value) : (value as number);
			return acc;
		},
		{} as Record<string, any>,
	);
}

export function getAllPossibleTimestamps(first_timestamp: number, last_timestamp: number, interval: AnalyticsInterval): number[] {
	const all_possible_timestamps = [];
	let current_time = getValidTimestamp(first_timestamp, interval);
	const last_valid_timestamp = getValidTimestamp(last_timestamp, interval);
	while (current_time <= last_timestamp) {
		all_possible_timestamps.push(current_time);
		current_time = getNextTimestamp(current_time, interval);
	}
	if (!all_possible_timestamps.includes(last_valid_timestamp)) {
		all_possible_timestamps.push(last_valid_timestamp);
	}
	return all_possible_timestamps;
}

function getValidTimestamp(timestamp: number, interval: AnalyticsInterval): number {
	const time_interval = getTimeInterval(interval);
	return DateTime.fromSeconds(timestamp).startOf(time_interval).toSeconds();
}

export function getNextTimestamp(timestamp: number, interval: AnalyticsInterval): number {
	if (interval === AnalyticsInterval.Hour) return DateTime.fromSeconds(timestamp).plus({hours: 1}).toSeconds();
	if (interval === AnalyticsInterval.Day) return DateTime.fromSeconds(timestamp).plus({days: 1}).toSeconds();
	if (interval === AnalyticsInterval.Week) return DateTime.fromSeconds(timestamp).plus({weeks: 1}).toSeconds();
	if (interval === AnalyticsInterval.Month) return DateTime.fromSeconds(timestamp).plus({months: 1}).toSeconds();
	return DateTime.fromSeconds(timestamp).plus({days: 1}).toSeconds();
}

export function getAmountData(
	unqiue_timestamps: number[],
	data_keyed_by_timestamp: Record<number, number>,
	unit: string,
	cumulative: boolean,
): {x: number; y: number}[] {
	let running_sum = 0;
	return unqiue_timestamps.map((timestamp) => {
		const val = data_keyed_by_timestamp[timestamp] || 0;
		running_sum += LocalAmountPipe.getConvertedAmount(unit, val);
		return {
			x: timestamp * 1000,
			y: cumulative ? running_sum : LocalAmountPipe.getConvertedAmount(unit, val),
		};
	});
}

export function getYAxisId(unit: string): string {
	if (unit === 'usd') return 'yfiat';
	if (unit === 'eur') return 'yfiat';
	return 'ybtc';
}

export function getTimeInterval(interval: AnalyticsInterval): DateTimeUnit {
	if (!interval) return 'day';
	if (interval === AnalyticsInterval.Hour) return 'hour';
	if (interval === AnalyticsInterval.Week) return 'week';
	if (interval === AnalyticsInterval.Month) return 'month';
	return 'day';
}

/** Corrects the last data point with the live balance if it falls in the current period */
export function correctLastPointWithLiveBalance(
	data: {x: number; y: number}[],
	live_balance: number | null,
	interval: AnalyticsInterval,
): {x: number; y: number}[] {
	if (data.length === 0 || live_balance === null) return data;
	const last_point = data[data.length - 1];
	const last_timestamp_sec = last_point.x / 1000;
	const time_unit = getTimeInterval(interval);
	const current_period_start = DateTime.now().startOf(time_unit).toSeconds();
	if (last_timestamp_sec !== current_period_start) return data;
	return [...data.slice(0, -1), {x: last_point.x, y: live_balance}];
}

/**
 * Converts chart data with oracle prices, storing both original and converted values
 */
export function convertChartDataWithOracle(
	data: {x: number; y: number}[],
	unit: string,
	oracle_map: Map<number, number> | null,
	use_oracle: boolean,
): OracleChartDataPoint[] {
	const is_eligible = eligibleForOracleConversion(unit);

	return data.map((point) => {
		const timestamp_seconds = point.x / 1000;
		const oracle_price = oracle_map ? findNearestOraclePrice(oracle_map, timestamp_seconds) : null;
		const price = oracle_price?.price || null;
		const converted = is_eligible ? oracleConvertToUSDCents(point.y, price, unit) : null;

		return {
			x: point.x,
			y: use_oracle && converted !== null ? converted : point.y,
			y_original: point.y,
			y_converted: converted,
			unit: unit.toLowerCase(),
		};
	});
}

/**
 * Gets Y-axis ID considering oracle conversion state
 * When oracle is used for BTC units, they map to yfiat (USD)
 */
export function getYAxisIdWithOracle(unit: string, oracle_used: boolean): string {
	if (unit === 'usd' || unit === 'eur') return 'yfiat';
	if (oracle_used && eligibleForOracleConversion(unit)) return 'yfiat';
	return 'ybtc';
}
