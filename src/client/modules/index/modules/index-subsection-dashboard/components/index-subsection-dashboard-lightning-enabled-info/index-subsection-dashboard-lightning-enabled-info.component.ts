/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';

@Component({
	selector: 'orc-index-subsection-dashboard-lightning-enabled-info',
	standalone: false,
	templateUrl: './index-subsection-dashboard-lightning-enabled-info.component.html',
	styleUrl: './index-subsection-dashboard-lightning-enabled-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardLightningEnabledInfoComponent {
	@Input() lightning_info!: LightningInfo | null;
}
