export interface AnalyticsBackfillStatus {
	is_running: boolean;
	started_at?: number;
	errors?: number;
	hours_completed?: number;
}
