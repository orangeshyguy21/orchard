/* Application Dependencies */
import { MintDashboardSettings, MintKeysetsSettings, MintDatabaseSettings } from '@client/modules/cache/services/local-storage/local-storage.types';

export type AllMintDashboardSettings = MintDashboardSettings & {
	date_start: number | null;
	date_end: number | null;
}

export type NonNullableMintDashboardSettings = {
	[K in keyof AllMintDashboardSettings]: NonNullable<AllMintDashboardSettings[K]>;
};

export type AllMintKeysetsSettings = MintKeysetsSettings & {
	date_start: number | null;
	date_end: number | null;
}


export type NonNullableMintKeysetsSettings = {
	[K in keyof AllMintKeysetsSettings]: NonNullable<AllMintKeysetsSettings[K]>;
};

export type AllMintDatabaseSettings = MintDatabaseSettings & {
	date_start: number | null;
	date_end: number | null;
}

export type NonNullableMintDatabaseSettings = {
	[K in keyof AllMintDatabaseSettings]: NonNullable<AllMintDatabaseSettings[K]>;
};