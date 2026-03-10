/* Core Dependencies */
import {Field, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
/* Native Dependencies */
import {SystemMetric} from '@server/modules/system/metrics/sysmetrics.enums';

@ObjectType()
export class OrchardSystemMetrics {
	@Field(() => SystemMetric)
	metric: SystemMetric;

	@Field(() => Float)
	value: number;

	@Field(() => Float, {nullable: true})
	min: number | null;

	@Field(() => Float, {nullable: true})
	max: number | null;

	@Field(() => UnixTimestamp)
	date: number;

	constructor(metric: SystemMetric, value: number, date: number, min?: number | null, max?: number | null) {
		this.metric = metric;
		this.value = value;
		this.date = date;
		this.min = min ?? null;
		this.max = max ?? null;
	}
}
