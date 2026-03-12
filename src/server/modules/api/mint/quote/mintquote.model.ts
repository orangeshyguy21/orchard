/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'Cashu mint quote TTL settings'})
export class OrchardMintQuoteTtls {
	@Field(() => Int, {nullable: true, description: 'Mint quote time-to-live in seconds'})
	mint_ttl: number;

	@Field(() => Int, {nullable: true, description: 'Melt quote time-to-live in seconds'})
	melt_ttl: number;
}
