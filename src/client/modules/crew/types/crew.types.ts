import {OrchardCrewUser, OrchardCrewInvite} from '@shared/generated.types';

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

export type CrewUserUpdateResponse = {
	crew_user_update: OrchardCrewUser;
};

export type CrewUserDeleteResponse = {
	crew_user_delete: boolean;
};
export type CrewInvitesResponse = {
	crew_invites: OrchardCrewInvite[];
};

export type CrewInviteCreateResponse = {
	crew_invite_create: OrchardCrewInvite;
};

export type CrewInviteUpdateResponse = {
	crew_invite_update: OrchardCrewInvite;
};

export type CrewInviteDeleteResponse = {
	crew_invite_delete: boolean;
};
