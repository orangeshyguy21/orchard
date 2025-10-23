/* Core Dependencies */
import {ObjectType, Field} from '@nestjs/graphql';
/* Application Dependencies */
import {User} from '@server/modules/user/user.entity';
import {UserRole} from '@server/modules/user/user.enums';
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';

@ObjectType()
export class OrchardUser {
	@Field()
	id: string;

	@Field()
	name: string;

	@Field(() => UserRole)
	role: UserRole;

	@Field()
	active: boolean;

	@Field({nullable: true})
	label: string | null;

	@Field(() => UnixTimestamp)
	created_at: number;

	@Field(() => UnixTimestamp)
	updated_at: number;

	constructor(user: User) {
		this.id = user.id;
		this.name = user.name;
		this.role = user.role;
		this.active = user.active;
		this.label = user.label;
		this.created_at = user.created_at.getTime() / 1000;
		this.updated_at = user.updated_at.getTime() / 1000;
	}
}
