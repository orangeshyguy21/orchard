/* Application Dependencies */
import {
	MintDashboardSettings,
	MintKeysetsSettings,
	MintDatabaseSettings,
} from '@client/modules/cache/services/local-storage/local-storage.types';

/* Page: Mint Dashboard */
export type AllMintDashboardSettings = MintDashboardSettings & {
	date_start: number | null;
	date_end: number | null;
};
export type NonNullableMintDashboardSettings = {
	[K in keyof AllMintDashboardSettings]: NonNullable<AllMintDashboardSettings[K]>;
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
