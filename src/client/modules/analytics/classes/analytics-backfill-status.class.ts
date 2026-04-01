/* Shared Dependencies */
import {OrchardAnalyticsBackfillStatus} from '@shared/generated.types';

export class AnalyticsBackfillStatus implements OrchardAnalyticsBackfillStatus {
	is_running: boolean;
	started_at?: number | null;
	errors?: number | null;
	hours_completed?: number | null;

	constructor(status: OrchardAnalyticsBackfillStatus) {
		this.is_running = status.is_running;
		this.started_at = status.started_at ?? null;
		this.errors = status.errors ?? null;
		this.hours_completed = status.hours_completed ?? null;
	}
}
