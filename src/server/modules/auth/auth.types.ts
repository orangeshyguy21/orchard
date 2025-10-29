/* Application Dependencies */
import {UserRole} from '@server/modules/user/user.enums';

export type OrchardAuthToken = {
	access_token: string;
	refresh_token: string;
};

export type JwtPayload = {
	sub: string;
	username: string;
	role: UserRole;
	type: 'access' | 'refresh';
};

export type RefreshTokenPayload = {
	sub: string;
	username: string;
	role: UserRole;
	type: 'refresh';
};
