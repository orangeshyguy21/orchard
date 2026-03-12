/* Core Dependencies */
import {Field, Float, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'Cashu mint proof group statistics'})
export class OrchardMintProofGroupStats {
	@Field(() => Float, {description: 'Median proof amount'})
	median: number;
}
