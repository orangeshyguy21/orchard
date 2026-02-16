/* Core Dependencies */
import {InputType, Field, Int, Float} from '@nestjs/graphql';

@InputType()
export class MintRotateKeysetInput {
	@Field()
	unit: string;

	@Field(() => [Float], {nullable: true})
	amounts: number[];

	@Field(() => Int, {nullable: true})
	input_fee_ppk: number;
}
