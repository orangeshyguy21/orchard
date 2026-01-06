/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheet} from '@angular/material/bottom-sheet';
/* Application Dependencies */
import {EventData} from 'src/client/modules/event/classes/event-data.class';
/* Native Dependencies */
import {NavSecondaryItem} from '@client/modules/nav/types/nav-secondary-item.type';
/* Components */
import {NavMobileSheetProfileComponent} from '../nav-mobile-sheet-profile/nav-mobile-sheet-profile.component';
import {NavMobileSheetMenuComponent} from '../nav-mobile-sheet-menu/nav-mobile-sheet-menu.component';

@Component({
	selector: 'orc-nav-mobile',
	standalone: false,
	templateUrl: './nav-mobile.component.html',
	styleUrl: './nav-mobile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.collapsed]': '!opened()',
	},
})
export class NavMobileComponent {
	/* Inputs */
	public opened = input.required<boolean>();
	public active_section = input.required<string>();
	public active_event = input.required<EventData | null>();
	public enabled_ai = input.required<boolean>();
	public enabled_bitcoin = input.required<boolean>();
	public enabled_lightning = input.required<boolean>();
	public enabled_mint = input.required<boolean>();
	public online_bitcoin = input.required<boolean>();
	public online_lightning = input.required<boolean>();
	public online_mint = input.required<boolean>();
	public syncing_bitcoin = input.required<boolean>();
	public syncing_lightning = input.required<boolean>();
	public block_count = input.required<number>();
	public user_name = input.required<string>();

	/* Outputs */
	public save = output<void>();
	public cancel = output<void>();
	public abort = output<void>();
	public showAgent = output<void>();

	private menuItems: Record<string, NavSecondaryItem[]> = {
		index: [
			{
				name: 'Home',
				navroute: '',
			},
			{
				name: 'Crew',
				navroute: 'crew',
			},
		],
		bitcoin: [
			{
				name: 'Dashboard',
				navroute: 'bitcoin',
			},
		],
		lightning: [
			{
				name: 'Dashboard',
				navroute: 'lightning',
			},
		],
		mint: [
			{
				name: 'Dashboard',
				navroute: 'mint',
			},
			{
				name: 'Info',
				navroute: 'mint/info',
			},
			{
				name: 'Config',
				navroute: 'mint/config',
			},
			{
				name: 'Keysets',
				navroute: 'mint/keysets',
			},
			{
				name: 'Database',
				navroute: 'mint/database',
			},
		],
		ecash: [
			{
				name: 'Dashboard',
				navroute: 'ecash',
			},
		],
	};

	constructor(private bottomSheet: MatBottomSheet) {}

	public onMenuClick() {
		const items = this.menuItems[this.active_section()];
		this.bottomSheet.open(NavMobileSheetMenuComponent, {
			data: {
				items: items,
				active_section: this.active_section(),
			},
		});
	}

	public onAgentClick() {
		this.showAgent.emit();
	}

	public onSettingsClick() {
		console.log('settings clicked');
	}

	public onProfileClick() {
		this.bottomSheet.open(NavMobileSheetProfileComponent);
	}
}
