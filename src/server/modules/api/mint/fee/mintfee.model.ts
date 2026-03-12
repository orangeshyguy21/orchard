/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {MintUnit} from '@server/modules/cashu/cashu.enums';
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {CashuMintFee} from '@server/modules/cashu/mintdb/cashumintdb.types';

@ObjectType({description: 'Cashu mint fee snapshot'})
export class OrchardMintFee {
	@Field(() => MintUnit, {description: 'Currency unit'})
	unit: string;

	@Field(() => Int, {description: 'Keyset balance in unit'})
	keyset_balance: number;

	@Field(() => Int, {description: 'Total fees paid by keyset'})
	keyset_fees_paid: number;

	@Field(() => Int, {description: 'Backend balance in unit'})
	backend_balance: number;

	@Field(() => UnixTimestamp, {description: 'Snapshot timestamp'})
	time: number;

	constructor(cashu_mint_fee: CashuMintFee) {
		this.unit = cashu_mint_fee.unit;
		this.keyset_balance = cashu_mint_fee.keyset_balance;
		this.keyset_fees_paid = cashu_mint_fee.keyset_fees_paid;
		this.backend_balance = cashu_mint_fee.backend_balance;
		this.time = cashu_mint_fee.time;
	}
}
