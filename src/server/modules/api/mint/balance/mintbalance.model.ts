/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {CashuMintBalance} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {oracleConvertToUSDCents} from '@server/modules/bitcoin/utxoracle/utxoracle.helpers';

@ObjectType()
export class OrchardMintBalance {
	@Field()
	keyset: string;

	@Field(() => Int)
	balance: number;

	@Field(() => Int, {nullable: true})
	balance_oracle: number | null;

	constructor(cashu_mint_balance: CashuMintBalance, utx_oracle_price: number | null) {
		this.keyset = cashu_mint_balance.keyset;
		this.balance = cashu_mint_balance.balance;
		this.balance_oracle = oracleConvertToUSDCents(this.balance, utx_oracle_price, cashu_mint_balance.unit);
	}
}
