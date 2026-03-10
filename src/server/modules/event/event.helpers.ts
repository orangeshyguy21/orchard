/* Application Dependencies */
import {UserRole} from '@server/modules/user/user.enums';
/* Local Dependencies */
import {EventLogActorType} from './event.enums';

/**
 * Derive the event log actor type from the request user context.
 * Returns AGENT when the user role is AGENT, USER otherwise.
 */
export function getActorType(user?: {role?: string}): EventLogActorType {
	return user?.role === UserRole.AGENT ? EventLogActorType.AGENT : EventLogActorType.USER;
}
