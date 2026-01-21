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
	payments_out_msat: bigint;
	invoices_in_msat: bigint;
	forward_fees_msat: bigint;
	channel_opens_msat: bigint;
	channel_closes_msat: bigint;
}
