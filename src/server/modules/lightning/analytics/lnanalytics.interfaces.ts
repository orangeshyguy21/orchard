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
	started_at?: number;
	errors?: number;
	hours_completed?: number;
}

export interface HourlyMetrics {
	payments_out: bigint;
	invoices_in: bigint;
	forward_fees: bigint;
	channel_opens: bigint;
	channel_closes: bigint;
}

/**
 * Maps asset_id to group_key for Taproot Assets
 */
export type AssetIdToGroupKeyMap = Map<string, string>;
