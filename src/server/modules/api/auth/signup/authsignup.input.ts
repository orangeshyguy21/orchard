/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';

@InputType({description: 'Input for registering a new user account'})
export class AuthSignupInput {
	@Field({description: 'Signup key for authorization'})
	key: string;

	@Field({description: 'Username for the new account'})
	name: string;

	@Field({description: 'Password for the new account'})
	password: string;
}
