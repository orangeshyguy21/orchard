/* Core Dependencies */
import {Field, Int, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {CashuMintProofGroup} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {MintUnit, MintProofState} from '@server/modules/cashu/cashu.enums';

@ObjectType()
export class OrchardMintProofGroup {
	@Field((type) => Int)
	amount: number;

	@Field((type) => UnixTimestamp)
	created_time: number;

	@Field((type) => [String])
	keyset_ids: string[];

	@Field((type) => MintUnit)
	unit: MintUnit;

	@Field((type) => MintProofState)
	state: MintProofState;

	@Field((type) => [[Int]])
	amounts: number[][];

	constructor(cashu_mint_pg: CashuMintProofGroup) {
		this.amount = cashu_mint_pg.amount;
		this.created_time = cashu_mint_pg.created_time;
		this.keyset_ids = cashu_mint_pg.keyset_ids;
		this.unit = cashu_mint_pg.unit;
		this.state = cashu_mint_pg.state;
		this.amounts = cashu_mint_pg.amounts;
	}
}

@ObjectType()
export class OrchardMintProofGroupStats {
	@Field((type) => Float)
	median: number;
}
