/* Shared Dependencies */
import {MintUnit, MintAnalyticsInterval} from '@shared/generated.types';
/* Application Dependencies */
import {ChartType} from '@client/modules/mint/enums/chart-type.enum';
import {MintDataType} from '@client/modules/mint/enums/data-type.enum';

export type Timezone = {
	tz: string | null;
};

export type Locale = {
	code: string | null;
};

export type Theme = {
	type: ThemeType | null;
};

export type Model = {
	model: string | null;
};

export enum ThemeType {
	DARK_MODE = 'dark-mode',
	LIGHT_MODE = 'light-mode',
}

export type MintDashboardSettings = {
	date_start: number | null;
	units: MintUnit[] | null;
	interval: MintAnalyticsInterval | null;
	type: ChartType | null;
	chart_navigation: string[] | null;
};

export type MintKeysetsSettings = {
	date_start: number | null;
	units: MintUnit[] | null;
	status: boolean[] | null;
};

export type MintDatabaseSettings = {
	date_start: number | null;
	type: MintDataType | null;
	units: MintUnit[] | null;
	states: string[] | null;
};
