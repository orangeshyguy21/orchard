/* Core Dependencies */
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class MintRotateKeysetInput {
	@Field()
	unit: string;

	@Field(() => Int, { nullable: true })
	max_order: number;

	@Field(() => Int, { nullable: true })
	input_fee_ppk: number;
}