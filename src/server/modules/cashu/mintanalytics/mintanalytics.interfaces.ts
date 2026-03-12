/* Native Dependencies */
import {MintAnalyticsMetric} from './mintanalytics.enums';

export interface MintAnalyticsBackfillStatus {
	is_running: boolean;
	started_at?: number;
	errors?: number;
	hours_completed?: number;
}

export interface MintAnalyticsCachedArgs {
	date_start?: number;
	date_end?: number;
	metrics?: MintAnalyticsMetric[];
	units?: string[];
}
