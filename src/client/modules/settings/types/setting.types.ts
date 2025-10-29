/* Application Dependencies */
import {
	MintDashboardSettings,
	MintKeysetsSettings,
	MintDatabaseSettings,
	MintConfigSettings,
	SettingsDeviceSettings,
} from '@client/modules/cache/services/local-storage/local-storage.types';

/* Page: Mint Dashboard */
export type AllMintDashboardSettings = MintDashboardSettings & {
	date_start: number | null;
	date_end: number | null;
};
export type NonNullableMintDashboardSettings = {
	[K in keyof AllMintDashboardSettings]: NonNullable<AllMintDashboardSettings[K]>;
};

/* Page: Mint Config */
export type AllMintConfigSettings = MintConfigSettings;
export type NonNullableMintConfigSettings = {
	[K in keyof MintConfigSettings]: NonNullable<MintConfigSettings[K]>;
};

/* Page: Mint Keysets */
export type AllMintKeysetsSettings = MintKeysetsSettings & {
	date_start: number | null;
	date_end: number | null;
};
export type NonNullableMintKeysetsSettings = {
	[K in keyof AllMintKeysetsSettings]: NonNullable<AllMintKeysetsSettings[K]>;
};

/* Page: Mint Database */
export type AllMintDatabaseSettings = MintDatabaseSettings & {
	date_start: number | null;
	date_end: number | null;
	page: number | null;
	page_size: number | null;
};
export type NonNullableMintDatabaseSettings = {
	[K in keyof AllMintDatabaseSettings]: NonNullable<AllMintDatabaseSettings[K]>;
};

/* Page: Settings Device */
export type AllSettingsDeviceSettings = SettingsDeviceSettings;
export type NonNullableSettingsDeviceSettings = {
	[K in keyof AllSettingsDeviceSettings]: NonNullable<AllSettingsDeviceSettings[K]>;
};
