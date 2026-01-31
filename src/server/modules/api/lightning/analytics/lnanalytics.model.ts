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

    @Field(() => String, {nullable: true})
	amount_oracle: string;

	@Field(() => UnixTimestamp)
	date: number;

	constructor(unit: string, metric: LightningAnalyticsMetric, amount: string, date: number, amount_oracle: number | null) {
		this.unit = unit;
		this.metric = metric;
		this.amount = amount;
		this.date = date;
        this.amount_oracle = amount_oracle?.toString() ?? null;
	}
}

@ObjectType()
export class OrchardLightningAnalyticsBackfillStatus {
	@Field(() => Boolean)
	is_running: boolean;

	@Field(() => UnixTimestamp, {nullable: true})
	started_at?: number;

	@Field(() => Number, {nullable: true})
	errors?: number;

	@Field(() => Number, {nullable: true})
	hours_completed?: number;
}
