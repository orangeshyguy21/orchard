/* Core Dependencies */
import {ObjectType, Field} from '@nestjs/graphql';

@ObjectType()
export class OrchardInitialization {
	@Field()
	initialization: boolean;

	constructor(initialization: boolean) {
		this.initialization = initialization;
	}
}
