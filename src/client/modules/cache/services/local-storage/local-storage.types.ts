/* Application Dependencies */
import {ChartType} from '@client/modules/mint/enums/chart-type.enum';
import {MintDataType} from '@client/modules/mint/enums/data-type.enum';
import {DateRangePreset} from '@client/modules/form/types/form-daterange.types';
/* Shared Dependencies */
import {MintUnit, MintAnalyticsInterval} from '@shared/generated.types';

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

export type Currency = {
	type_btc: CurrencyType;
	type_fiat: CurrencyType;
};

export enum ThemeType {
	DARK_MODE = 'dark-mode',
	LIGHT_MODE = 'light-mode',
}

export enum CurrencyType {
	CODE = 'code',
	GLYPH = 'glyph',
}

export type BitcoinOracleSettings = {
	date_start: number | null;
	date_preset: DateRangePreset | null;
};

export type MintDashboardSettings = {
	date_start: number | null;
	date_preset: DateRangePreset | null;
	units: MintUnit[] | null;
	interval: MintAnalyticsInterval | null;
	tertiary_nav: string[] | null;
	oracle_used: boolean | null;
	type: {
		balance_sheet: ChartType | null;
		mints: ChartType | null;
		melts: ChartType | null;
		swaps: ChartType | null;
		fee_revenue: ChartType | null;
	};
};

export type MintConfigSettings = {
	tertiary_nav: string[] | null;
};

export type MintKeysetsSettings = {
	date_start: number | null;
	date_preset: DateRangePreset | null;
	units: MintUnit[] | null;
	status: boolean[] | null;
};

export type MintDatabaseSettings = {
	date_start: number | null;
	date_preset: DateRangePreset | null;
	type: MintDataType | null;
	units: MintUnit[] | null;
	states: string[] | null;
};

export type SettingsDeviceSettings = {
	tertiary_nav: string[] | null;
};

export type EventLogSettings = {
	date_start: number | null;
	date_preset: DateRangePreset | null;
	page_size: number | null;
};
