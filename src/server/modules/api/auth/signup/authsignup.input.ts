/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';

@InputType()
export class AuthSignupInput {
	@Field()
	key: string;

	@Field()
	name: string;

	@Field()
	password: string;
}
