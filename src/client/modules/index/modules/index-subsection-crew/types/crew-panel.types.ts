/* Native Dependencies */
import {CrewState} from '@client/modules/index/modules/index-subsection-crew/enums/crew-entity.enum';
/* Shared Dependencies */
import {UserRole} from '@shared/generated.types';

export type StateOption = {
	label: string;
	value: CrewState;
};
export type RoleOption = {
	label: string;
	value: UserRole;
};
