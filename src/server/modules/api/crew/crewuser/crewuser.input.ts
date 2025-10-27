/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';

@InputType()
export class UserNameUpdateInput {
	@Field()
	name: string;
}

@InputType()
export class UserPasswordUpdateInput {
	@Field()
	password_old: string;

	@Field()
	password_new: string;
}
