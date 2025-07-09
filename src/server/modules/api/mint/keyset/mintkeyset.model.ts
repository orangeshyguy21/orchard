/* Core Dependencies */
import { Field, Int, ID, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { CashuMintKeyset } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { MintUnit } from '@server/modules/cashu/cashu.enums';

@ObjectType()
export class OrchardMintKeyset {
	@Field(type => ID)
	id: string;

	@Field()
	derivation_path: string;

	@Field(type => Int)
	derivation_path_index: number;

	@Field(type => UnixTimestamp)
	valid_from: number;

	@Field(type => UnixTimestamp, { nullable: true })
	valid_to: number;

	@Field()
	active: boolean;

	@Field()
	unit: MintUnit;

	@Field(type => Int)
	input_fee_ppk: number;

	@Field(type => Int, { nullable: true })
	fees_paid: number;

	constructor(cashu_keyset:CashuMintKeyset) {
		this.id = cashu_keyset.id;
		this.derivation_path = cashu_keyset.derivation_path;
		this.derivation_path_index = cashu_keyset.derivation_path_index;
		this.valid_from = cashu_keyset.valid_from;
		this.valid_to = cashu_keyset.valid_to;
		this.active = !!cashu_keyset.active;
		this.unit = cashu_keyset.unit;
		this.input_fee_ppk = cashu_keyset.input_fee_ppk;
		this.fees_paid = cashu_keyset.fees_paid;
	}
}

@ObjectType()
export class OrchardMintKeysetRotation {
	@Field()
	id: string;
	
	@Field()
	unit: string;

	@Field(() => Int, { nullable: true })
	max_order: number;

	@Field(() => Int, { nullable: true })
	input_fee_ppk: number;
}
