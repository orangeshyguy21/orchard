/* Core Dependencies */
import {ObjectType, Field} from '@nestjs/graphql';
/* Application Dependencies */
import {User} from '@server/modules/user/user.entity';
import {UserRole} from '@server/modules/user/user.enums';
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';

@ObjectType()
export class OrchardCrewUser {
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

	@Field({nullable: true})
	telegram_chat_id: string | null;

	@Field(() => UnixTimestamp)
	created_at: number;

	constructor(user: User) {
		this.id = user.id;
		this.name = user.name;
		this.role = user.role;
		this.active = user.active;
		this.label = user.label;
		this.telegram_chat_id = user.telegram_chat_id;
		this.created_at = user.created_at;
	}
}
