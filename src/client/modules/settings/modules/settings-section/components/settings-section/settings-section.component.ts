/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';

@Component({
	selector: 'orc-settings-section',
	standalone: false,
	templateUrl: './settings-section.component.html',
	styleUrl: './settings-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSectionComponent {
	public version: string;

	constructor(private configService: ConfigService) {
		this.version = this.configService.config.mode.version;
	}
}
