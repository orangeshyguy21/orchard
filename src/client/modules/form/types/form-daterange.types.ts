export enum DateRangePreset {
    Last7Days = 'last_7_days',
    Last30Days = 'last_30_days',
    Last90Days = 'last_90_days',
    ThisQuarter = 'this_quarter',
    ThisYear = 'this_year',
    LastYear = 'last_year',
    AllTime = 'all_time',
}

export type DateRangePresetOption = {
    label: string;
    value: DateRangePreset;
};

export const DATE_RANGE_PRESET_OPTIONS: DateRangePresetOption[] = [
    {label: 'Last 7 days', value: DateRangePreset.Last7Days},
    {label: 'Last 30 days', value: DateRangePreset.Last30Days},
    {label: 'Last 90 days', value: DateRangePreset.Last90Days},
    {label: 'This Quarter', value: DateRangePreset.ThisQuarter},
    {label: 'This Year', value: DateRangePreset.ThisYear},
    {label: 'Last Year', value: DateRangePreset.LastYear},
    {label: 'All Time', value: DateRangePreset.AllTime},
];
