import {OrchardLightningAnalyticsBackfillStatus} from '@shared/generated.types';

export class LightningAnalyticsBackfillStatus implements OrchardLightningAnalyticsBackfillStatus {
	is_running: boolean;
	started_at?: number;
	errors?: number;
	hours_completed?: number;

	constructor(status: OrchardLightningAnalyticsBackfillStatus) {
		this.is_running = status.is_running;
		this.started_at = status.started_at ?? undefined;
		this.errors = status.errors ?? undefined;
		this.hours_completed = status.hours_completed ?? undefined;
	}
}
