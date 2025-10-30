/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';
/* Application Dependencies */
import {UserRole} from '@server/modules/user/user.enums';

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

@InputType()
export class UserUpdateInput {
	@Field()
	id: string;

	@Field({nullable: true})
	label?: string;

	@Field(() => UserRole, {nullable: true})
	role?: UserRole;

	@Field(() => Boolean, {nullable: true})
	active?: boolean;
}