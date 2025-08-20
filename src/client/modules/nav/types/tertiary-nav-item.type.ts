import {TertiaryNavItemStatus} from '../enums/tertiary-nav-item-status.enum';

export type TertiaryNavItem = {
	title: string;
	subtitle?: string;
	status?: TertiaryNavItemStatus;
};
