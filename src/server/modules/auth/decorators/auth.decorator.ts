import {SetMetadata} from '@nestjs/common';
import {UserRole} from '@server/modules/user/user.enums';

export const PUBLIC_KEY = 'public';
export const Public = () => SetMetadata(PUBLIC_KEY, true);

export const NO_HEADERS_KEY = 'no_headers';
export const NoHeaders = () => SetMetadata(NO_HEADERS_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
