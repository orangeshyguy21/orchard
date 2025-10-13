/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';

@Component({
	selector: 'orc-index-section',
	standalone: false,
	templateUrl: './index-section.component.html',
	styleUrl: './index-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSectionComponent {
	public version: string;

	constructor(private configService: ConfigService) {
		this.version = this.configService.config.mode.version;
	}
}
