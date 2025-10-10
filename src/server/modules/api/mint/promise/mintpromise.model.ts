/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {CashuMintPromiseGroup} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {MintUnit} from '@server/modules/cashu/cashu.enums';

@ObjectType()
export class OrchardMintPromiseGroup {
	@Field(() => Int)
	amount: number;

	@Field(() => UnixTimestamp)
	created_time: number;

	@Field(() => [String])
	keyset_ids: string[];

	@Field(() => MintUnit)
	unit: MintUnit;

	@Field(() => [[Int]])
	amounts: number[][];

	constructor(cashu_mint_pg: CashuMintPromiseGroup) {
		this.amount = cashu_mint_pg.amount;
		this.created_time = cashu_mint_pg.created_time;
		this.keyset_ids = cashu_mint_pg.keyset_ids;
		this.unit = cashu_mint_pg.unit;
		this.amounts = cashu_mint_pg.amounts;
	}
}
