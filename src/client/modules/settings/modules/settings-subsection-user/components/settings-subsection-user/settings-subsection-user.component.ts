import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-settings-subsection-user',
	standalone: false,
	templateUrl: './settings-subsection-user.component.html',
	styleUrl: './settings-subsection-user.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionUserComponent {}
