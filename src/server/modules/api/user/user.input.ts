/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';

@InputType()
export class UserNameUpdateInput {
	@Field()
	id: string;

	@Field()
	name: string;
}

@InputType()
export class UserPasswordUpdateInput {
	@Field()
	id: string;

	@Field()
	password_old: string;

	@Field()
	password_new: string;
}
