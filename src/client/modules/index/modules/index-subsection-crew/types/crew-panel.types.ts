/* Native Dependencies */
import {CrewEntity} from '@client/modules/index/modules/index-subsection-crew/enums/crew-entity.enum';
/* Shared Dependencies */
import {UserRole} from '@shared/generated.types';

export type EntityOption = {
	label: string;
	value: CrewEntity;
};
export type RoleOption = {
	label: string;
	value: UserRole;
};
