import {OrchardUser, UserRole} from '@shared/generated.types';

export class User implements OrchardUser {
	id: string;
	name: string;
	role: UserRole;
	active: boolean;
	created_at: number;
	updated_at: number;

	constructor(ou: OrchardUser) {
		this.id = ou.id;
		this.name = ou.name;
		this.role = ou.role;
		this.active = ou.active;
		this.created_at = ou.created_at;
		this.updated_at = ou.updated_at;
	}
}
