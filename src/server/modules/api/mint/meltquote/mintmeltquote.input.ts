/* Core Dependencies */
import {InputType, Field, Int} from '@nestjs/graphql';

@InputType()
export class MintNut05UpdateInput {
	@Field()
	unit: string;

	@Field()
	method: string;

	@Field({nullable: true})
	disabled: boolean;

	@Field(() => Int, {nullable: true})
	min_amount: number;

	@Field(() => Int, {nullable: true})
	max_amount: number;
}
