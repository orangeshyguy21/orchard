/* Core Dependencies */
import {Field, Float, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardBitcoinOracleBounds {
	@Field(() => Float)
	min: number;

	@Field(() => Float)
	max: number;
}

@ObjectType()
export class OrchardBitcoinOracleBlockWindow {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@ObjectType()
export class OrchardBitcoinOracleIntradayPoint {
	@Field(() => Int)
	block_height: number;

	@Field(() => Int)
	timestamp: number;

	@Field(() => Float)
	price: number;
}

@ObjectType()
export class OrchardBitcoinOracle {
	@Field(() => Float)
	central_price: number;

	@Field(() => Float)
	rough_price_estimate: number;

	@Field(() => Float)
	deviation_pct: number;

	@Field(() => OrchardBitcoinOracleBounds)
	bounds: OrchardBitcoinOracleBounds;

	@Field(() => OrchardBitcoinOracleBlockWindow)
	block_window: OrchardBitcoinOracleBlockWindow;

	@Field(() => [OrchardBitcoinOracleIntradayPoint], {nullable: true})
	intraday?: OrchardBitcoinOracleIntradayPoint[];
}
