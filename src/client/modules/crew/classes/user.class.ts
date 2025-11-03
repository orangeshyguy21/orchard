import {OrchardCrewUser, UserRole} from '@shared/generated.types';

export class User implements OrchardCrewUser {
	id: string;
	name: string;
	role: UserRole;
	label: string | null;
	active: boolean;
	created_at: number;

	constructor(ou: OrchardCrewUser) {
		this.id = ou.id;
		this.name = ou.name;
		this.role = ou.role;
		this.label = ou.label ?? null;
		this.active = ou.active;
		this.created_at = ou.created_at;
	}
}
