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

	@Field(() => Int, {nullable: true})
	balance_oracle: number | null;

	constructor(cashu_mint_balance: CashuMintBalance, oracle_price: number | null) {
		this.keyset = cashu_mint_balance.keyset;
		this.balance = cashu_mint_balance.balance;
		this.balance_oracle = oracle_price;
	}
}
