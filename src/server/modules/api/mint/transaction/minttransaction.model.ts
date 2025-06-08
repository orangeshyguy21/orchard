/* Core Dependencies */
import { Field, Int, ID, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { CashuMintTransaction } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { MintUnit, MintProofState } from '@server/modules/cashu/cashu.enums';

@ObjectType()
export class OrchardMintTransaction {

	@Field(type => Int)
	amount: number;

	@Field(type => UnixTimestamp)
	created_time: number;

	@Field(type => String)
	keyset_id: string;

    @Field()
	unit: MintUnit;

	@Field()
	state: MintProofState;

	@Field(type => [Int])
	promises: number[];

	constructor(cashu_mint_transaction: CashuMintTransaction) {
		this.amount = cashu_mint_transaction.amount;
		this.created_time = cashu_mint_transaction.created_time;
		this.keyset_id = cashu_mint_transaction.keyset_id;
		this.unit = cashu_mint_transaction.unit;
		this.state = cashu_mint_transaction.state;
		this.promises = cashu_mint_transaction.promises;
	}
}