/* Core Dependencies */
import {Field, Int, Float, ID, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {CashuMintKeyset, CashuMintKeysetProofCount} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {MintUnit} from '@server/modules/cashu/cashu.enums';

@ObjectType()
export class OrchardMintKeyset {
	@Field(() => ID)
	id: string;

	@Field()
	derivation_path: string;

	@Field(() => Int)
	derivation_path_index: number;

	@Field(() => UnixTimestamp, {nullable: true})
	valid_from: number;

	@Field(() => UnixTimestamp, {nullable: true})
	valid_to: number;

	@Field()
	active: boolean;

	@Field()
	unit: MintUnit;

	@Field(() => Int, {nullable: true})
	input_fee_ppk: number;

	@Field(() => Int)
	fees_paid: number;

	@Field(() => [Float], {nullable: true})
	amounts: number[];


	constructor(cashu_keyset: CashuMintKeyset) {
		this.id = cashu_keyset.id;
		this.derivation_path = cashu_keyset.derivation_path;
		this.derivation_path_index = cashu_keyset.derivation_path_index;
		this.valid_from = cashu_keyset.valid_from;
		this.valid_to = cashu_keyset.valid_to;
		this.active = !!cashu_keyset.active;
		this.unit = cashu_keyset.unit;
		this.input_fee_ppk = cashu_keyset.input_fee_ppk;
		this.fees_paid = cashu_keyset.fees_paid ?? 0;
		this.amounts = typeof cashu_keyset.amounts === 'string' ? JSON.parse(cashu_keyset.amounts) : cashu_keyset.amounts ?? [];
	}
}

@ObjectType()
export class OrchardMintKeysetRotation {
	@Field()
	id: string;

	@Field()
	unit: string;

	@Field(() => [Float], {nullable: true})
	amounts: number[];

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
