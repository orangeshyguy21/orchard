/* Core Dependencies */
import {Injectable} from '@angular/core';
/* Native Dependencies */
import {NavSecondaryItem} from '@client/modules/nav/types/nav-secondary-item.type';

@Injectable({
	providedIn: 'root',
})
export class NavService {
	private menuItems: Record<string, NavSecondaryItem[]> = {
		index: [
			{
				name: 'Home',
				navroute: '',
				subsection: 'home',
			},
			{
				name: 'Crew',
				navroute: 'crew',
				subsection: 'crew',
			},
		],
		bitcoin: [
			{
				name: 'Dashboard',
				navroute: 'bitcoin',
				subsection: 'dashboard',
			},
		],
		lightning: [
			{
				name: 'Dashboard',
				navroute: 'lightning',
				subsection: 'dashboard',
			},
		],
		mint: [
			{
				name: 'Dashboard',
				navroute: 'mint',
				subsection: 'dashboard',
			},
			{
				name: 'Info',
				navroute: 'mint/info',
				subsection: 'info',
			},
			{
				name: 'Config',
				navroute: 'mint/config',
				subsection: 'config',
			},
			{
				name: 'Keysets',
				navroute: 'mint/keysets',
				subsection: 'keysets',
			},
			{
				name: 'Database',
				navroute: 'mint/database',
				subsection: 'database',
			},
		],
		ecash: [
			{
				name: 'Dashboard',
				navroute: 'ecash',
				subsection: 'dashboard',
			},
		],
	};

	public getMenuItems(section: string): NavSecondaryItem[] {
		return this.menuItems[section];
	}
}
