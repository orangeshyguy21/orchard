/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {MintUnit} from '@server/modules/cashu/cashu.enums';
import {CashuMintAnalytics, CashuMintKeysetsAnalytics} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';

@ObjectType()
export class OrchardMintAnalytics {
	@Field(() => MintUnit)
	unit: string;

	@Field(() => Int)
	amount: number;

	@Field(() => Int, {nullable: true})
	amount_oracle: number | null;

	@Field(() => UnixTimestamp)
	created_time: number;

	@Field(() => Int)
	operation_count: number;

	constructor(cashu_mint_analytics: CashuMintAnalytics, amount_oracle: number | null) {
		this.unit = cashu_mint_analytics.unit;
		this.amount = cashu_mint_analytics.amount;
		this.created_time = cashu_mint_analytics.created_time;
		this.operation_count = cashu_mint_analytics.operation_count;
        this.amount_oracle = amount_oracle;
	}
}

@ObjectType()
export class OrchardMintKeysetsAnalytics {
	@Field(() => String)
	keyset_id: string;

	@Field(() => Int)
	amount: number;

	@Field(() => UnixTimestamp)
	created_time: number;

	constructor(cashu_mint_keysets_analytics: CashuMintKeysetsAnalytics) {
		this.keyset_id = cashu_mint_keysets_analytics.keyset_id;
		this.amount = cashu_mint_keysets_analytics.amount;
		this.created_time = cashu_mint_keysets_analytics.created_time;
	}
}
