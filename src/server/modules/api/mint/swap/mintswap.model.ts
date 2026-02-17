/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {CashuMintSwap} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {MintUnit} from '@server/modules/cashu/cashu.enums';

@ObjectType()
export class OrchardMintSwap {
	@Field(() => String, {nullable: true})
	operation_id: string;

	@Field(() => [String])
	keyset_ids: string[];

	@Field(() => MintUnit)
	unit: MintUnit;

	@Field(() => Int)
	amount: number;

	@Field(() => UnixTimestamp)
	created_time: number;

	@Field(() => Int)
	fee: number;

	constructor(swap: CashuMintSwap) {
		this.operation_id = swap.operation_id;
		this.keyset_ids = swap.keyset_ids;
		this.unit = swap.unit;
		this.amount = swap.amount;
		this.created_time = swap.created_time;
		this.fee = swap.fee;
	}
}
