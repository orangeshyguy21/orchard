/* Shared Dependencies */
import { MintUnit, MintAnalyticsInterval } from '@shared/generated.types';
/* Application Dependencies */
import { ChartType } from '@client/modules/mint/enums/chart-type.enum';
import { DataType } from '@client/modules/orchard/enums/data.enum';

export type Timezone = {
    tz: string | null;
}

export type Locale = {
    code: string | null;
}

export type Theme = {
    type: ThemeType | null;
}

export type Model = {
    model: string | null;
}

export enum ThemeType {
    DARK_MODE = 'dark-mode',
    LIGHT_MODE = 'light-mode',
}

export type MintDashboardSettings = {
    units: MintUnit[] | null;
    interval: MintAnalyticsInterval | null;
    type: ChartType | null;
}

export type MintKeysetsSettings = {
    units: MintUnit[] | null;
    status: boolean[] | null;
}

export type MintDatabaseSettings = {
    type: DataType | null;
    units: MintUnit[] | null;
    states: string[] | null;
}