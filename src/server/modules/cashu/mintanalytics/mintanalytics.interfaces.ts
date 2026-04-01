/* Native Dependencies */
import {MintAnalyticsMetric} from './mintanalytics.enums';

export interface MintAnalyticsCachedArgs {
	date_start?: number;
	date_end?: number;
	metrics?: MintAnalyticsMetric[];
	units?: string[];
}
