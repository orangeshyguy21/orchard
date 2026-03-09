/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
/* Native Dependencies */
import {LightningAnalyticsMetric} from '@server/modules/lightning/analytics/lnanalytics.enums';

@ObjectType()
export class OrchardLightningAnalytics {
	@Field(() => String)
	unit: string;

	@Field(() => String)
	amount: string;

	@Field(() => UnixTimestamp)
	date: number;

	@Field(() => Int, {nullable: true})
	count?: number;

	constructor(unit: string, amount: string, date: number, count?: number) {
		this.unit = unit;
		this.amount = amount;
		this.date = date;
		this.count = count;
	}
}

@ObjectType()
export class OrchardLightningAnalyticsMetric {
	@Field(() => String)
	unit: string;

	@Field(() => LightningAnalyticsMetric)
	metric: LightningAnalyticsMetric;

	@Field(() => String)
	amount: string;

	@Field(() => UnixTimestamp)
	date: number;

	@Field(() => Int, {nullable: true})
	count?: number;

	constructor(unit: string, metric: LightningAnalyticsMetric, amount: string, date: number, count?: number) {
		this.unit = unit;
		this.metric = metric;
		this.amount = amount;
		this.date = date;
		this.count = count;
	}
}

@ObjectType()
export class OrchardLightningAnalyticsBackfillStatus {
	@Field(() => Boolean)
	is_running: boolean;

	@Field(() => UnixTimestamp, {nullable: true})
	started_at?: number;

	@Field(() => Int, {nullable: true})
	errors?: number;

	@Field(() => Int, {nullable: true})
	hours_completed?: number;
}
