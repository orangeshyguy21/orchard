/* Shared Dependencies */
import {OrchardAnalyticsBackfillStatus} from '@shared/generated.types';

export class AnalyticsBackfillStatus implements OrchardAnalyticsBackfillStatus {
	is_running: boolean;
	started_at?: number | null;
	errors?: number | null;
	last_processed_at?: number | null;
	total_streams?: number | null;
	streams_completed?: number | null;

	constructor(status: OrchardAnalyticsBackfillStatus) {
		this.is_running = status.is_running;
		this.started_at = status.started_at ?? null;
		this.errors = status.errors ?? null;
		this.last_processed_at = status.last_processed_at ?? null;
		this.total_streams = status.total_streams ?? null;
		this.streams_completed = status.streams_completed ?? null;
	}
}
