/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheet} from '@angular/material/bottom-sheet';
/* Application Dependencies */
import {EventData} from 'src/client/modules/event/classes/event-data.class';
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

	constructor(private bottomSheet: MatBottomSheet) {}

	public onMenuClick() {
		this.bottomSheet.open(NavMobileSheetMenuComponent, {
			data: {
				active_section: this.active_section(),
				enabled_ai: this.enabled_ai(),
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
