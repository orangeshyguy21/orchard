/* Application Dependencies */
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
import { AmountPipe } from '@client/modules/local/pipes/amount/amount.pipe';

type AnalyticsGroup = Record<string, MintAnalytic[]>

export function groupAnalyticsByUnit(analytics: MintAnalytic[]): AnalyticsGroup {
    return analytics.reduce((groups, analytic) => {
        const unit = analytic.unit;
        groups[unit] = groups[unit] || [];
        groups[unit].push(analytic);
        return groups;
    }, {} as Record<string, MintAnalytic[]>);
}

export function addPreceedingData(analytics: AnalyticsGroup, preceding_data: MintAnalytic[]): AnalyticsGroup {
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

export function getDataOrgainizedByTimestamp(analytics: MintAnalytic[], first_timestamp: string, last_timestamp: string): Record<string, number> {
    const records = analytics.reduce((acc, item) => {
        acc[item.created_time] = item.amount;
        return acc;
    }, {} as Record<string, number>);
    if( records[last_timestamp] === undefined ) records[last_timestamp] = 0;
    if( records[first_timestamp] === undefined ) records[first_timestamp] = 0;
    return records;
}


export function getCumulativeData(unqiue_timestamps:string[], timestamp_to_amount: Record<string, number>, unit: string): { x: number, y: number }[] { 
    let running_sum = 0;
    return unqiue_timestamps
        .filter(timestamp => timestamp_to_amount[timestamp] !== undefined)
        .map(timestamp => {
            running_sum += AmountPipe.getConvertedAmount(unit, timestamp_to_amount[timestamp]);
            return {
                x: Number(timestamp) * 1000,
                y: running_sum
            };
        });
}