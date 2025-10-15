import {OrchardLightningAnalytics} from '@shared/generated.types';

export class LightningAnalytics implements OrchardLightningAnalytics {
	public amount: number;
	public unit: string;
	public created_time: number;

	constructor(olc: OrchardLightningAnalytics) {
		this.amount = olc.amount;
		this.unit = olc.unit;
		this.created_time = olc.created_time;
	}
}
