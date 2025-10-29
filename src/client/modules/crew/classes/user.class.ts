import {OrchardCrewUser, UserRole} from '@shared/generated.types';

export class User implements OrchardCrewUser {
	id: string;
	name: string;
	role: UserRole;
	active: boolean;
	created_at: number;

	constructor(ou: OrchardCrewUser) {
		this.id = ou.id;
		this.name = ou.name;
		this.role = ou.role;
		this.active = ou.active;
		this.created_at = ou.created_at;
	}
}
