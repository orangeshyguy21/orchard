/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';
/* Application Dependencies */
import {UserRole} from '@server/modules/user/user.enums';
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';

@InputType()
export class InviteCreateInput {
	@Field({nullable: true})
	label?: string;

	@Field(() => UserRole)
	role: UserRole;

	@Field(() => UnixTimestamp, {nullable: true})
	expires_at?: number;
}

@InputType()
export class InviteUpdateInput {
	@Field()
	id: string;

	@Field({nullable: true})
	label?: string;

	@Field(() => UserRole, {nullable: true})
	role: UserRole;

	@Field(() => UnixTimestamp, {nullable: true})
	expires_at?: number;
}
