/* Core Dependencies */
import {InputType, Field, Int} from '@nestjs/graphql';

@InputType({description: 'Input for updating quote TTL settings'})
export class MintQuoteTtlUpdateInput {
	@Field(() => Int, {nullable: true, description: 'New mint quote time-to-live in seconds'})
	mint_ttl: number;

	@Field(() => Int, {nullable: true, description: 'New melt quote time-to-live in seconds'})
	melt_ttl: number;
}
