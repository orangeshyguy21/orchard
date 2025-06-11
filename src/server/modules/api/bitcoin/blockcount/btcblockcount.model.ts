/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrchardBitcoinBlockCount {

	@Field(type => Int)
	height: number;

	constructor(height: number) {
		this.height = height;
	}
}