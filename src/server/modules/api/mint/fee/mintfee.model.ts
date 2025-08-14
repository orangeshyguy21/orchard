/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {MintUnit} from '@server/modules/cashu/cashu.enums';
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {CashuMintFee} from '@server/modules/cashu/mintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintFee {
	@Field((type) => MintUnit)
	unit: string;

	@Field((type) => Int)
	keyset_balance: number;

	@Field((type) => Int)
	keyset_fees_paid: number;

	@Field((type) => Int)
	backend_balance: number;

	@Field((type) => UnixTimestamp)
	time: number;

	constructor(cashu_mint_fee: CashuMintFee) {
		this.unit = cashu_mint_fee.unit;
		this.keyset_balance = cashu_mint_fee.keyset_balance;
		this.keyset_fees_paid = cashu_mint_fee.keyset_fees_paid;
		this.backend_balance = cashu_mint_fee.backend_balance;
		this.time = cashu_mint_fee.time;
	}
}
