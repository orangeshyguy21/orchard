/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
/* Vendor Dependencies */
import {MatBottomSheet} from '@angular/material/bottom-sheet';
/* Application Dependencies */
import {EventData} from 'src/client/modules/event/classes/event-data.class';
import {NavMobileSheetProfileComponent} from '../nav-mobile-sheet-profile/nav-mobile-sheet-profile.component';

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
	public block_count = input.required<number>();
	public active_event = input.required<EventData | null>();
	public user_name = input.required<string>();
	public ai_enabled = input.required<boolean>();

	/* Outputs */
	public save = output<void>();
	public cancel = output<void>();
	public abort = output<void>();

	constructor(private bottomSheet: MatBottomSheet) {}

	public onMenuClick() {
		console.log('menu clicked');
	}

	public onAgentClick() {
		console.log('agent clicked');
	}

	public onSettingsClick() {
		console.log('settings clicked');
	}

	public onProfileClick() {
		this.bottomSheet.open(NavMobileSheetProfileComponent);
	}
}
