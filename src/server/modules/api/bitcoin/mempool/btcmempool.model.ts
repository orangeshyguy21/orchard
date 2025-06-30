/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrchardBitcoinMempool {

	@Field(type => Int)
	test: number;

	constructor(test: number) {
		this.test = test;
	}
}