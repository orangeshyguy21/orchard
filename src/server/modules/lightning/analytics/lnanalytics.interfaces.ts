/* Application Dependencies */
import {TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
/* Local Dependencies */
import {LightningAnalyticsInterval, LightningAnalyticsMetric} from './lnanalytics.enums';

export interface LightningAnalyticsArgs {
	date_start?: number;
	date_end?: number;
	interval?: LightningAnalyticsInterval;
	timezone?: TimezoneType;
	metrics?: LightningAnalyticsMetric[];
}

export interface LightningAnalyticsBackfillStatus {
	is_running: boolean;
	current_hour?: number;
	target_hour?: number;
	hours_completed?: number;
	hours_remaining?: number;
	started_at?: number;
	errors?: number;
}

export interface HourlyMetrics {
	payments_out: bigint;
	invoices_in: bigint;
	forward_fees: bigint;
	channel_opens: bigint;
	channel_closes: bigint;
}

/**
 * Grouped hourly metrics keyed by group_key (null for BTC, string for Taproot Assets)
 */
export interface GroupedHourlyMetrics {
	group_key: string | null;
	unit: string;
	metrics: HourlyMetrics;
}

/**
 * Maps asset_id to group_key for Taproot Assets
 */
export type AssetIdToGroupKeyMap = Map<string, string>;
