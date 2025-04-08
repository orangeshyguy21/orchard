/* Core Dependencies */
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class RotateNextKeysetInput {
	@Field()
	unit: string;

	@Field(() => Int, { nullable: true })
	max_order: number;

	@Field(() => Int, { nullable: true })
	input_fee_ppk: number;
}