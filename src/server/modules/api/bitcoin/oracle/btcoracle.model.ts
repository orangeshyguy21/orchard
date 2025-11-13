/* Core Dependencies */
import {Field, Float, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {UTXOracle} from '@server/modules/bitcoin/utxoracle/utxoracle.entity';

@ObjectType()
export class OrchardBitcoinOraclePrice {
	@Field(() => UnixTimestamp)
	date: number;

	@Field(() => Float)
	price: number;

	constructor(data: UTXOracle) {
		this.date = data.date;
		this.price = data.price;
	}
}

@ObjectType()
export class OrchardBitcoinOracleBackfillStream {
	@Field(() => String)
	id: string;
}

@ObjectType()
export class OrchardBitcoinOracleBackfillProgress {
	@Field(() => String)
	id: string;

	@Field(() => String)
	status: 'started' | 'processing' | 'completed' | 'aborted' | 'error';

	@Field(() => UnixTimestamp, {nullable: true})
	start_date?: number;

	@Field(() => UnixTimestamp, {nullable: true})
	end_date?: number;

	@Field(() => UnixTimestamp, {nullable: true})
	date?: number;

	@Field(() => Int, {nullable: true})
	price?: number;

	@Field(() => Boolean, {nullable: true})
	success?: boolean;

	@Field(() => String, {nullable: true})
	error?: string;

	@Field(() => Int, {nullable: true})
	total_days?: number;

	@Field(() => Int, {nullable: true})
	processed?: number;

	@Field(() => Int, {nullable: true})
	successful?: number;

	@Field(() => Int, {nullable: true})
	failed?: number;

	constructor(data: Partial<OrchardBitcoinOracleBackfillProgress>) {
		Object.assign(this, data);
	}
}
