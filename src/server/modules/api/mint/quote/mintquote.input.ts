/* Core Dependencies */
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class UpdateQuoteTtlInput {
	@Field(() => Int, { nullable: true })
	mint_ttl: number;

	@Field(() => Int, { nullable: true })
	melt_ttl: number;
}