/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
/* Native Dependencies */
import {LightningAnalyticsMetric} from '@server/modules/lightning/analytics/lnanalytics.enums';

@ObjectType()
export class OrchardLightningAnalytics {
	@Field(() => String)
	unit: string;

	@Field(() => LightningAnalyticsMetric)
	metric: LightningAnalyticsMetric;

	@Field(() => String)
	amount: string;

	@Field(() => UnixTimestamp)
	date: number;

	constructor(unit: string, metric: LightningAnalyticsMetric, amount: string, date: number) {
		this.unit = unit;
		this.metric = metric;
		this.amount = amount;
		this.date = date;
	}
}

@ObjectType()
export class OrchardLightningAnalyticsBackfillStatus {
	@Field(() => Boolean)
	is_running: boolean;

	@Field(() => UnixTimestamp, {nullable: true})
	current_hour?: number;

	@Field(() => UnixTimestamp, {nullable: true})
	target_hour?: number;

	@Field(() => Number, {nullable: true})
	hours_completed?: number;

	@Field(() => Number, {nullable: true})
	hours_remaining?: number;

	@Field(() => UnixTimestamp, {nullable: true})
	started_at?: number;

	@Field(() => Number, {nullable: true})
	errors?: number;
}
