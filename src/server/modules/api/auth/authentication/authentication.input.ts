/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';

@InputType()
export class InitializationInput {
	@Field()
	key: string;

	@Field()
	name: string;

	@Field()
	password: string;
}

@InputType()
export class AuthenticationInput {
	@Field()
	name: string;

	@Field()
	password: string;
}
