/* Core Dependencies */
import {Field, Float, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardMintProofGroupStats {
	@Field(() => Float)
	median: number;
}
