/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'Cashu mint operation count'})
export class OrchardMintCount {
	@Field(() => Int, {description: 'Total number of matching operations'})
	count: number;

	constructor(count: number) {
		this.count = count;
	}
}
