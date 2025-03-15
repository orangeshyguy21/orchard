/* Application Dependencies */
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
import { AmountPipe } from '@client/modules/local/pipes/amount/amount.pipe';
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

export function prependData(analytics: AnalyticsGroup, preceding_data: MintAnalytic[]): AnalyticsGroup {
    if( preceding_data.length === 0 )  return analytics;
    for (const unit in analytics) {
        const analytics_for_unit = analytics[unit];
        const preceding_data_for_unit = preceding_data.find(p => p.unit === unit);
        if( !preceding_data_for_unit ) continue;
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

export function getDataKeyedByTimestamp(analytics: MintAnalytic[]): Record<string, number> {
    return analytics.reduce((acc, item) => {
        acc[item.created_time] = item.amount;
        return acc;
    }, {} as Record<string, number>);
}

export function getAllPossibleTimestamps(first_timestamp: number, last_timestamp: number, interval: MintAnalyticsInterval): number[] {
    const all_possible_timestamps = [];
    const interval_seconds = getIntervalSeconds(interval);
    let current_time = first_timestamp;
    while (current_time <= last_timestamp) {
        all_possible_timestamps.push(current_time);
        current_time += interval_seconds;
    }
    if (!all_possible_timestamps.includes(last_timestamp)) {
        all_possible_timestamps.push(last_timestamp);
    }
    return all_possible_timestamps;
}

function getIntervalSeconds(interval: MintAnalyticsInterval): number {
    if (interval === MintAnalyticsInterval.Day) return 86400;
    if (interval === MintAnalyticsInterval.Week) return 604800;
    if (interval === MintAnalyticsInterval.Month) return 2592000;
    return 86400;
}

export function getCumulativeData(unqiue_timestamps:number[], timestamp_to_amount: Record<number, number>, unit: string): { x: number, y: number }[] { 
    let running_sum = 0;
    return unqiue_timestamps
        .map(timestamp => {
            const val = timestamp_to_amount[timestamp] || 0;
            running_sum += AmountPipe.getConvertedAmount(unit, val);
            return {
                x: timestamp * 1000,
                y: running_sum
            };
        });
}