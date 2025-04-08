/* Core Dependencies */
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class UpdateNut04Input {
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

	@Field({ nullable: true })
	description: boolean;	
}

@InputType()
export class UpdateQuoteTtlInput {
	@Field(() => Int, { nullable: true })
	mint_ttl: number;

	@Field(() => Int, { nullable: true })
	melt_ttl: number;
}

@InputType()
export class UpdateNut04QuoteInput {
	@Field()
	quote_id: string;

	@Field()
	state: string;
}