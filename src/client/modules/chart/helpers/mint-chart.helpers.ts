import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';

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