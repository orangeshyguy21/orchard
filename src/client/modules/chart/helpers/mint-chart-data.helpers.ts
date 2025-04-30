/* Application Dependencies */
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
import { AmountPipe } from '@client/modules/local/pipes/amount/amount.pipe';
/* Vendor Dependencies */
import { DateTime } from 'luxon';
/* Shared Dependencies */
import { MintAnalyticsInterval } from '@shared/generated.types';

type AnalyticsGroup = Record<string, MintAnalytic[]>

export function groupAnalyticsByUnit(analytics: MintAnalytic[]): AnalyticsGroup {
    return analytics.reduce((groups, analytic) => {
        const unit = analytic.unit;
        groups[unit] = groups[unit] || [];
        groups[unit].push(analytic);
        return groups;
    }, {} as Record<string, MintAnalytic[]>);
}

export function prependData(analytics: AnalyticsGroup, preceding_data: MintAnalytic[], timestamp_first: number): AnalyticsGroup {
    if( preceding_data.length === 0 ) return analytics;
    if( Object.keys(analytics).length === 0 ) return preceding_data.reduce((groups, analytic) => {
        analytic.created_time = timestamp_first;
        groups[analytic.unit] = groups[analytic.unit] || [];
        groups[analytic.unit].push(analytic);
        return groups;
    }, {} as Record<string, MintAnalytic[]>);

    for (const unit in analytics) {
        const analytics_for_unit = analytics[unit];
        const preceding_data_for_unit = preceding_data.find(p => p.unit === unit);
        if( !preceding_data_for_unit ) continue;
        preceding_data_for_unit.created_time = timestamp_first;
        const matching_datapoint = analytics_for_unit.find(a => a.created_time === preceding_data_for_unit.created_time);
        preceding_data_for_unit.operation_count = 0;
        if( !matching_datapoint ) {
            analytics_for_unit.unshift(preceding_data_for_unit);
        }else{
            matching_datapoint.amount = matching_datapoint.amount + preceding_data_for_unit.amount;
        }
    }
    return analytics;
}

export function getDataKeyedByTimestamp(analytics: MintAnalytic[], metric: string): Record<string, number> {
    return analytics.reduce((acc, item) => {
        acc[item.created_time] = item[metric as keyof MintAnalytic];
        return acc;
    }, {} as Record<string, any>);
}

export function getAllPossibleTimestamps(first_timestamp: number, last_timestamp: number, interval: MintAnalyticsInterval): number[] {
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

function getValidTimestamp(timestamp: number, interval: MintAnalyticsInterval): number {
    if (interval === MintAnalyticsInterval.Day) return DateTime.fromSeconds(timestamp).startOf('day').toSeconds();
    if (interval === MintAnalyticsInterval.Week) return DateTime.fromSeconds(timestamp).startOf('week').toSeconds();
    if (interval === MintAnalyticsInterval.Month) return DateTime.fromSeconds(timestamp).startOf('month').toSeconds();
    return DateTime.fromSeconds(timestamp).startOf('day').toSeconds(); // Default to day
}

function getNextTimestamp(timestamp: number, interval: MintAnalyticsInterval): number {
    if (interval === MintAnalyticsInterval.Day) return DateTime.fromSeconds(timestamp).plus({ days: 1 }).toSeconds();
    if (interval === MintAnalyticsInterval.Week) return DateTime.fromSeconds(timestamp).plus({ weeks: 1 }).toSeconds();
    if (interval === MintAnalyticsInterval.Month) return DateTime.fromSeconds(timestamp).plus({ months: 1 }).toSeconds();
    return DateTime.fromSeconds(timestamp).plus({ days: 1 }).toSeconds();
}

export function getAmountData(unqiue_timestamps:number[], data_keyed_by_timestamp: Record<number, number>, unit: string, cumulative: boolean): { x: number, y: number }[] { 
    let running_sum = 0;
    return unqiue_timestamps.map(timestamp => {
        const val = data_keyed_by_timestamp[timestamp] || 0;
        running_sum += AmountPipe.getConvertedAmount(unit, val);
        return {
            x: timestamp * 1000,
            y: cumulative ? running_sum : AmountPipe.getConvertedAmount(unit, val)
        };
    });
}

export function getRawData(unqiue_timestamps:number[], data_keyed_by_timestamp: Record<number, number>, unit: string): { x: number, y: number }[] { 
    return unqiue_timestamps.map(timestamp => {
        const val = data_keyed_by_timestamp[timestamp] || 0;
        return {
            x: timestamp * 1000,
            y: val
        };
    });
}


export function getYAxisId(unit: string): string {
    if( unit === 'usd' ) return 'yfiat';
    if( unit === 'eur' ) return 'yfiat';
    return 'ybtc';
}