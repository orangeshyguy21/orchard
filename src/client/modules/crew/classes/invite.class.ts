import {OrchardCrewInvite, UserRole} from '@shared/generated.types';

export class Invite implements OrchardCrewInvite {
	id: string;
	token: string;
	label: string | null;
	role: UserRole;
	created_by_id: string;
	claimed_by_id: string | null;
	used_at: number | null;
	expires_at: number | null;
	created_at: number;

	constructor(oi: OrchardCrewInvite) {
		this.id = oi.id;
		this.token = oi.token;
		this.label = oi.label ?? null;
		this.role = oi.role;
		this.created_by_id = oi.created_by_id;
		this.claimed_by_id = oi.claimed_by_id ?? null;
		this.used_at = oi.used_at ?? null;
		this.expires_at = oi.expires_at ?? null;
		this.created_at = oi.created_at;
	}
}
