/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MintQuoteTtlOutput {
	@Field(() => Int, { nullable: true })
	mint_ttl: number;

	@Field(() => Int, { nullable: true })
	melt_ttl: number;
}