/* Core Dependencies */
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class UpdateNut05Input {
	@Field()
	unit: string;

	@Field()
	method: string;

	@Field({ nullable: true })
	disabled: boolean;  

	@Field(() => Int, { nullable: true })
	min: number;

	@Field(() => Int, { nullable: true })
	max: number;
}