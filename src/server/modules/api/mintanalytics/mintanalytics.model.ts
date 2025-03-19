/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { MintUnit } from '@server/modules/cashu/cashu.enums';
import { CashuMintAnalytics } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
@ObjectType()
export class OrchardMintAnalytics {

	@Field(type => MintUnit)
	unit: string;

	@Field(type => Int)
	amount: number;

	@Field(type => UnixTimestamp)
	created_time: number;

	@Field(type => Int)
	operation_count: number;

	constructor(cashu_mint_analytics: CashuMintAnalytics) {
		this.unit = cashu_mint_analytics.unit;
		this.amount = cashu_mint_analytics.amount;
		this.created_time = cashu_mint_analytics.created_time;
		this.operation_count = cashu_mint_analytics.operation_count;
	}
}