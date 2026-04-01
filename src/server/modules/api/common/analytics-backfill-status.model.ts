/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {AnalyticsBackfillStatus} from '@server/modules/analytics/analytics.interfaces';

@ObjectType({description: 'Analytics backfill job status'})
export class OrchardAnalyticsBackfillStatus {
	@Field(() => Boolean, {description: 'Whether the backfill job is currently running'})
	is_running: boolean;

	@Field(() => UnixTimestamp, {nullable: true, description: 'Timestamp when the backfill started'})
	started_at?: number;

	@Field(() => Int, {nullable: true, description: 'Number of errors encountered during backfill'})
	errors?: number;

	@Field(() => Int, {nullable: true, description: 'Number of hours completed in the backfill'})
	hours_completed?: number;

	constructor(status: AnalyticsBackfillStatus) {
		this.is_running = status.is_running;
		this.started_at = status.started_at;
		this.errors = status.errors;
		this.hours_completed = status.hours_completed;
	}
}
