import {OrchardLightningAnalytics, OrchardLightningAnalyticsMetric, LightningAnalyticsMetric} from '@shared/generated.types';

export class LightningAnalytic implements OrchardLightningAnalytics {
	unit: string;
	amount: string;
	date: number;
	count?: number | null;

	constructor(ola: OrchardLightningAnalytics) {
		this.unit = ola.unit;
		this.amount = ola.amount;
		this.date = ola.date;
		this.count = ola.count;
	}
}

export class LightningAnalyticMetric implements OrchardLightningAnalyticsMetric {
	unit: string;
	metric: LightningAnalyticsMetric;
	amount: string;
	date: number;
	count?: number | null;

	constructor(ola: OrchardLightningAnalyticsMetric) {
		this.unit = ola.unit;
		this.metric = ola.metric;
		this.amount = ola.amount;
		this.date = ola.date;
		this.count = ola.count;
	}
}
