import { ChartType } from "@client/modules/mint/enums/chart-type.enum";
import { MintAnalyticsInterval, MintUnit } from "@shared/generated.types";

export type Timezone = {
    tz: string|null;
}

export type Locale = {
    code: string|null;
}

export type MintAnalytics = {
    date_start: number|null;
    date_end: number|null;
    units: MintUnit[]|null;
    interval: MintAnalyticsInterval|null;
    type: ChartType|null;
}


// public readonly panel = new FormGroup({
//     daterange: new FormGroup({
//         date_start: new FormControl<DateTime | null>(null, [Validators.required]),
//         date_end: new FormControl<DateTime | null>(null, [Validators.required]),
//     }),
//     units: new FormControl<MintUnit[] | null>(null, [Validators.required]),
//     interval: new FormControl<MintAnalyticsInterval | null>(null, [Validators.required]),
//     type: new FormControl<ChartType | null>(null, [Validators.required]),
// });