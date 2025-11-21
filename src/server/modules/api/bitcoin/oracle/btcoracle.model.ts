/* Core Dependencies */
import {Field, Float, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {UTXOracle} from '@server/modules/bitcoin/utxoracle/utxoracle.entity';
import {UTXOracleProgressStatus} from '@server/modules/bitcoin/utxoracle/utxoracle.enums';

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

	@Field(() => UTXOracleProgressStatus)
	status: UTXOracleProgressStatus;

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

	@Field(() => Float, {nullable: true})
	date_progress?: number; // 0-100

	@Field(() => Float, {nullable: true})
	overall_progress?: number; // 0-100

	@Field(() => String, {nullable: true})
	message?: string;

	constructor(data: Partial<OrchardBitcoinOracleBackfillProgress>) {
		Object.assign(this, data);
	}
}
