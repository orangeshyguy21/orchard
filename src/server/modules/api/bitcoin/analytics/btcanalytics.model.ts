/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
/* Native Dependencies */
import {BitcoinAnalyticsMetric} from '@server/modules/bitcoin/analytics/btcanalytics.enums';

@ObjectType()
export class OrchardBitcoinAnalytics {
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
export class OrchardBitcoinAnalyticsMetric {
	@Field(() => String)
	unit: string;

	@Field(() => BitcoinAnalyticsMetric)
	metric: BitcoinAnalyticsMetric;

	@Field(() => String)
	amount: string;

	@Field(() => UnixTimestamp)
	date: number;

	@Field(() => Int, {nullable: true})
	count?: number;

	constructor(unit: string, metric: BitcoinAnalyticsMetric, amount: string, date: number, count?: number) {
		this.unit = unit;
		this.metric = metric;
		this.amount = amount;
		this.date = date;
		this.count = count;
	}
}

@ObjectType()
export class OrchardBitcoinAnalyticsBackfillStatus {
	@Field(() => Boolean)
	is_running: boolean;

	@Field(() => UnixTimestamp, {nullable: true})
	started_at?: number;

	@Field(() => Int, {nullable: true})
	errors?: number;

	@Field(() => Int, {nullable: true})
	hours_completed?: number;
}
