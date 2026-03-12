/* Core Dependencies */
import {ObjectType, Field} from '@nestjs/graphql';

@ObjectType({description: 'Application initialization status'})
export class OrchardInitialization {
	@Field({description: 'Whether the application has been initialized'})
	initialization: boolean;

	constructor(initialization: boolean) {
		this.initialization = initialization;
	}
}
