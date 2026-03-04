/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {MintUnit} from '@server/modules/cashu/cashu.enums';
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';

@ObjectType()
export class OrchardMintAnalytics {
	@Field(() => MintUnit)
	unit: string;

	@Field(() => String)
	amount: string;

	@Field(() => UnixTimestamp)
	date: number;

	constructor(unit: string, amount: string, date: number) {
		this.unit = unit;
		this.amount = amount;
		this.date = date;
	}
}

@ObjectType()
export class OrchardMintKeysetsAnalytics {
	@Field(() => String)
	keyset_id: string;

	@Field(() => String)
	amount: string;

	@Field(() => UnixTimestamp)
	date: number;

	constructor(keyset_id: string, amount: string, date: number) {
		this.keyset_id = keyset_id;
		this.amount = amount;
		this.date = date;
	}
}

@ObjectType()
export class OrchardMintAnalyticsBackfillStatus {
	@Field(() => Boolean)
	is_running: boolean;

	@Field(() => UnixTimestamp, {nullable: true})
	started_at?: number;

	@Field(() => Int, {nullable: true})
	errors?: number;

	@Field(() => Int, {nullable: true})
	hours_completed?: number;
}
