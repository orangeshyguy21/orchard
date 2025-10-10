/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardMintCount {
	@Field(() => Int)
	count: number;

	constructor(count: number) {
		this.count = count;
	}
}
