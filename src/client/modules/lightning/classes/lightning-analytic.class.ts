import {OrchardLightningAnalytics, LightningAnalyticsMetric} from '@shared/generated.types';

export class LightningAnalytic implements OrchardLightningAnalytics {
	unit: string;
	metric: LightningAnalyticsMetric;
	amount: string;
	date: number;

	constructor(ola: OrchardLightningAnalytics) {
		this.unit = ola.unit;
		this.metric = ola.metric;
		this.amount = ola.amount;
		this.date = ola.date;
	}
}
