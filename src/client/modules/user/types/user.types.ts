import {OrchardCrewUser} from '@shared/generated.types';

export type CrewUserResponse = {
	crew_user: OrchardCrewUser;
};

export type CrewUsersResponse = {
	crew_users: OrchardCrewUser[];
};

export type CrewUserNameUpdateResponse = {
	crew_user_name_update: OrchardCrewUser;
};

export type CrewUserPasswordUpdateResponse = {
	crew_user_password_update: OrchardCrewUser;
};
