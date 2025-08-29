/* Core Dependencies */
import {Field, Float, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardOracleBounds {
	@Field(() => Float)
	min: number;

	@Field(() => Float)
	max: number;
}

@ObjectType()
export class OrchardOracleBlockWindow {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@ObjectType()
export class OrchardOracleIntradayPoint {
	@Field(() => Int)
	block_height: number;

	@Field(() => Int)
	timestamp: number;

	@Field(() => Float)
	price: number;
}

@ObjectType()
export class OrchardOracleResult {
	@Field(() => Float)
	central_price: number;

	@Field(() => Float)
	rough_price_estimate: number;

	@Field(() => Float)
	deviation_pct: number;

	@Field(() => OrchardOracleBounds)
	bounds: OrchardOracleBounds;

	@Field(() => OrchardOracleBlockWindow)
	block_window: OrchardOracleBlockWindow;

	@Field(() => [OrchardOracleIntradayPoint], {nullable: true})
	intraday?: OrchardOracleIntradayPoint[];
}
