/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';

@InputType({description: 'Input for initializing the application with a first admin user'})
export class InitializationInput {
	@Field({description: 'Initialization key for authorization'})
	key: string;

	@Field({description: 'Username for the initial admin account'})
	name: string;

	@Field({description: 'Password for the initial admin account'})
	password: string;
}
