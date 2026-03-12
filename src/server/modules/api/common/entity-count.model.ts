/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'Entity count result'})
export class OrchardCommonCount {
	@Field(() => Int, {description: 'Total number of matching entities'})
	count: number;

	constructor(count: number) {
		this.count = count;
	}
}
