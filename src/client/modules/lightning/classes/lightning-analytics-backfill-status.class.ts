import {OrchardLightningAnalyticsBackfillStatus} from '@shared/generated.types';

export class LightningAnalyticsBackfillStatus implements OrchardLightningAnalyticsBackfillStatus {
	is_running: boolean;
	current_hour?: number;
	target_hour?: number;
	hours_completed?: number;
	hours_remaining?: number;
	started_at?: number;
	errors?: number;

	constructor(status: OrchardLightningAnalyticsBackfillStatus) {
		this.is_running = status.is_running;
		this.current_hour = status.current_hour ?? undefined;
		this.target_hour = status.target_hour ?? undefined;
		this.hours_completed = status.hours_completed ?? undefined;
		this.hours_remaining = status.hours_remaining ?? undefined;
		this.started_at = status.started_at ?? undefined;
		this.errors = status.errors ?? undefined;
	}
}
