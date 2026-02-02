/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {CashuMintBalance} from '@server/modules/cashu/mintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintBalance {
	@Field()
	keyset: string;

	@Field(() => Int)
	balance: number;

	constructor(cashu_mint_balance: CashuMintBalance) {
		this.keyset = cashu_mint_balance.keyset;
		this.balance = cashu_mint_balance.balance;
	}
}
