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
import {NavMobileSheetMenuSectionComponent} from '../nav-mobile-sheet-menu-section/nav-mobile-sheet-menu-section.component';
import {NavMobileSheetMenuSubsectionComponent} from '../nav-mobile-sheet-menu-subsection/nav-mobile-sheet-menu-subsection.component';

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
	public active_sub_section = input.required<string>();
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

	constructor(private bottomSheet: MatBottomSheet) {}

	public onMenuSectionClick() {
		console.log('menu section clicked');
		this.bottomSheet.open(NavMobileSheetMenuSectionComponent, {
			autoFocus: false,
			data: {
				active_section: this.active_section(),
				enabled_bitcoin: this.enabled_bitcoin(),
				enabled_lightning: this.enabled_lightning(),
				enabled_mint: this.enabled_mint(),
				online_bitcoin: this.online_bitcoin(),
				online_lightning: this.online_lightning(),
				online_mint: this.online_mint(),
				syncing_bitcoin: this.syncing_bitcoin(),
				syncing_lightning: this.syncing_lightning(),
			},
		});
	}

	public onMenuSubsectionClick() {
		const items = this.menuItems[this.active_section()];
		this.bottomSheet.open(NavMobileSheetMenuSubsectionComponent, {
			autoFocus: false,
			data: {
				items: items,
				active_sub_section: this.active_sub_section(),
				enabled: this.getSectionEnabled(this.active_section()),
				online: this.getSectionOnline(this.active_section()),
				syncing: this.getSectionSyncing(this.active_section()),
				icon: this.getSectionIcon(this.active_section()),
				name: this.getSectionName(this.active_section()),
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

	private getSectionEnabled(section: string): boolean {
		switch (section) {
			case 'bitcoin':
				return this.enabled_bitcoin();
			case 'lightning':
				return this.enabled_lightning();
			case 'mint':
				return this.enabled_mint();
			default:
				return false;
		}
	}

	private getSectionOnline(section: string): boolean {
		switch (section) {
			case 'bitcoin':
				return this.online_bitcoin();
			case 'lightning':
				return this.online_lightning();
			case 'mint':
				return this.online_mint();
			default:
				return false;
		}
	}

	private getSectionSyncing(section: string): boolean {
		switch (section) {
			case 'bitcoin':
				return this.syncing_bitcoin();
			case 'lightning':
				return this.syncing_lightning();
			default:
				return false;
		}
	}

	private getSectionIcon(section: string): string {
		switch (section) {
			case 'bitcoin':
				return 'bitcoin';
			case 'lightning':
				return 'bolt';
			case 'mint':
				return 'account_balance';
			case 'ecash':
				return 'payments';
			default:
				return 'home';
		}
	}

	private getSectionName(section: string): string {
		switch (section) {
			case 'bitcoin':
				return 'Bitcoin';
			case 'lightning':
				return 'Lightning';
			case 'mint':
				return 'Mint';
			case 'ecash':
				return 'E-Cash';
			default:
				return 'Home';
		}
	}
}
