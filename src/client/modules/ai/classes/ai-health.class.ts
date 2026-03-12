import {OrchardAiHealth} from '@shared/generated.types';

export class AiHealth implements OrchardAiHealth {
	message: string | null;
	status: boolean;
	vendor: string;

	constructor(health: OrchardAiHealth) {
		this.message = health.message ?? null;
		this.status = health.status;
		this.vendor = health.vendor;
	}
}
