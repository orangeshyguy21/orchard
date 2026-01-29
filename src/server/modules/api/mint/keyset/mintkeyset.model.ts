/* Core Dependencies */
import {Field, Int, ID, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {CashuMintKeyset, CashuMintKeysetProofCount} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {MintUnit} from '@server/modules/cashu/cashu.enums';
import {oracleConvertToUSDCents} from '@server/modules/bitcoin/utxoracle/utxoracle.helpers';

@ObjectType()
export class OrchardMintKeyset {
	@Field(() => ID)
	id: string;

	@Field()
	derivation_path: string;

	@Field(() => Int)
	derivation_path_index: number;

	@Field(() => UnixTimestamp)
	valid_from: number;

	@Field(() => UnixTimestamp, {nullable: true})
	valid_to: number;

	@Field()
	active: boolean;

	@Field()
	unit: MintUnit;

	@Field(() => Int, {nullable: true})
	input_fee_ppk: number;

	@Field(() => Int, {nullable: true})
	fees_paid: number;

	@Field(() => Int, {nullable: true})
	fees_paid_oracle: number | null;

	constructor(cashu_keyset: CashuMintKeyset, utx_oracle_price: number | null) {
		this.id = cashu_keyset.id;
		this.derivation_path = cashu_keyset.derivation_path;
		this.derivation_path_index = cashu_keyset.derivation_path_index;
		this.valid_from = cashu_keyset.valid_from;
		this.valid_to = cashu_keyset.valid_to;
		this.active = !!cashu_keyset.active;
		this.unit = cashu_keyset.unit;
		this.input_fee_ppk = cashu_keyset.input_fee_ppk;
		this.fees_paid = cashu_keyset.fees_paid;
		this.fees_paid_oracle = oracleConvertToUSDCents(this.fees_paid, utx_oracle_price, cashu_keyset.unit);
	}
}

@ObjectType()
export class OrchardMintKeysetRotation {
	@Field()
	id: string;

	@Field()
	unit: string;

	@Field(() => Int, {nullable: true})
	max_order: number;

	@Field(() => Int, {nullable: true})
	input_fee_ppk: number;
}

@ObjectType()
export class OrchardMintKeysetProofCount {
	@Field(() => ID)
	id: string;

	@Field(() => Int)
	count: number;

	constructor(cashu_keyset_proof_count: CashuMintKeysetProofCount) {
		this.id = cashu_keyset_proof_count.id;
		this.count = cashu_keyset_proof_count.count;
	}
}
