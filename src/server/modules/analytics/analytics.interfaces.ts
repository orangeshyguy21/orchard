export interface AnalyticsBackfillStatus {
	is_running: boolean;
	started_at?: number;
	errors?: number;
	last_processed_at?: number;
	total_streams?: number;
	streams_completed?: number;
}
