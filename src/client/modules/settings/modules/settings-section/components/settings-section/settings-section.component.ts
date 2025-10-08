/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
/* Application Configuration */
import {environment} from '@client/configs/configuration';

@Component({
	selector: 'orc-settings-section',
	standalone: false,
	templateUrl: './settings-section.component.html',
	styleUrl: './settings-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSectionComponent {
	public version = environment.mode.version;
}
