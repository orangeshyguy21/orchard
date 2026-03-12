/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';

@InputType({description: 'Input for authenticating a user'})
export class AuthenticationInput {
	@Field({description: 'Username for authentication'})
	name: string;

	@Field({description: 'Password for authentication'})
	password: string;
}
