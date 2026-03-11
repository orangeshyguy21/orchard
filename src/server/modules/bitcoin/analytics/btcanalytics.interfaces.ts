/* Application Dependencies */
import {TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
import {AnalyticsInterval} from '@server/modules/analytics/analytics.enums';
/* Local Dependencies */
import {BitcoinAnalyticsMetric} from './btcanalytics.enums';

export interface BitcoinAnalyticsArgs {
	date_start?: number;
	date_end?: number;
	interval?: AnalyticsInterval;
	timezone?: TimezoneType;
	metrics?: BitcoinAnalyticsMetric[];
}

export interface BitcoinAnalyticsBackfillStatus {
	is_running: boolean;
	started_at?: number;
	errors?: number;
	hours_completed?: number;
}

/**
 * Maps asset_id (hex) to group_key (hex) and unit name for Taproot Assets
 */
export type AssetInfoMap = Map<string, {group_key: string; unit: string}>;
