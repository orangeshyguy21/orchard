/* Core Dependencies */
import {ObjectType, Field} from '@nestjs/graphql';
/* Application Dependencies */
import {Invite} from '@server/modules/invite/invite.entity';
import {UserRole} from '@server/modules/user/user.enums';
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';

@ObjectType()
export class OrchardCrewInvite {
	@Field()
	id: string;

	@Field()
	token: string; // 12-character invite code

	@Field({nullable: true})
	label: string | null; // suggested username/label

	@Field(() => UserRole)
	role: UserRole; // role to assign when claimed

	@Field()
	created_by_id: string; // ID of admin who created invite

	@Field({nullable: true})
	claimed_by_id: string | null; // ID of user who claimed invite

	@Field()
	used: boolean; // whether invite has been claimed

	@Field(() => UnixTimestamp, {nullable: true})
	used_at: number | null; // when invite was claimed

	@Field(() => UnixTimestamp, {nullable: true})
	expires_at: number | null; // when invite expires

	@Field(() => UnixTimestamp)
	created_at: number; // when invite was created

	constructor(invite: Invite) {
		this.id = invite.id;
		this.token = invite.token;
		this.label = invite.label;
		this.role = invite.role;
		this.created_by_id = invite.created_by.id;
		this.claimed_by_id = invite.claimed_by?.id || null;
		this.used = invite.used;
		this.used_at = invite.used_at ? invite.used_at.getTime() / 1000 : null;
		this.expires_at = invite.expires_at ? invite.expires_at.getTime() / 1000 : null;
		this.created_at = invite.created_at.getTime() / 1000;
	}
}
