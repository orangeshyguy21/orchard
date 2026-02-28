/* Core Dependencies */
import {Field, Float, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';

@ObjectType()
export class OrchardMintActivityBucket {
	@Field(() => UnixTimestamp)
	created_time: number;

	@Field(() => Float)
	amount: number;
}

@ObjectType()
export class OrchardMintActivitySummary {
	@Field(() => Int)
	total_operations: number;

	@Field(() => Float)
	total_operations_delta: number;

	@Field(() => Float)
	total_volume: number;

	@Field(() => Float)
	total_volume_delta: number;

	@Field(() => Int)
	mint_count: number;

	@Field(() => Float)
	mint_count_delta: number;

	@Field(() => [OrchardMintActivityBucket])
	mint_sparkline: OrchardMintActivityBucket[];

	@Field(() => Int)
	melt_count: number;

	@Field(() => Float)
	melt_count_delta: number;

	@Field(() => [OrchardMintActivityBucket])
	melt_sparkline: OrchardMintActivityBucket[];

	@Field(() => Int)
	swap_count: number;

	@Field(() => Float)
	swap_count_delta: number;

	@Field(() => [OrchardMintActivityBucket])
	swap_sparkline: OrchardMintActivityBucket[];

	@Field(() => Float)
	mint_completed_pct: number;

	@Field(() => Float)
	mint_completed_pct_delta: number;

	@Field(() => Float)
	mint_avg_time: number;

	@Field(() => Float)
	mint_avg_time_delta: number;

	@Field(() => Float)
	melt_completed_pct: number;

	@Field(() => Float)
	melt_completed_pct_delta: number;

	@Field(() => Float)
	melt_avg_time: number;

	@Field(() => Float)
	melt_avg_time_delta: number;

	@Field(() => [String])
	warnings: string[];
}
