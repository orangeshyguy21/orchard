/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
/* Application Configuration */
import {environment} from '@client/configs/configuration';

@Component({
	selector: 'orc-index-section',
	standalone: false,
	templateUrl: './index-section.component.html',
	styleUrl: './index-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSectionComponent {
	public version = environment.mode.version;
}
