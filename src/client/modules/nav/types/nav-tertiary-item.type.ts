import {NavTertiaryItemStatus} from '../enums/nav-tertiary-item-status.enum';

export type NavTertiaryItem = {
	title: string;
	subtitle?: string;
	status?: NavTertiaryItemStatus;
};
