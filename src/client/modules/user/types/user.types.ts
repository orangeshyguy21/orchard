import {OrchardUser} from '@shared/generated.types';

export type UserResponse = {
	user: OrchardUser;
};

export type UserNameUpdateResponse = {
	user_name_update: OrchardUser;
};
