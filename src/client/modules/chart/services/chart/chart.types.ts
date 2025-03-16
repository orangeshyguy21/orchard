/* Application Dependencies */
import { MintChartSettings } from '@client/modules/cache/services/local-storage/local-storage.types';

export type AllMintChartSettings = MintChartSettings & {
  date_start: number | null;
  date_end: number | null;
}

export type NonNullableMintChartSettings = {
	[K in keyof AllMintChartSettings]: NonNullable<AllMintChartSettings[K]>;
};