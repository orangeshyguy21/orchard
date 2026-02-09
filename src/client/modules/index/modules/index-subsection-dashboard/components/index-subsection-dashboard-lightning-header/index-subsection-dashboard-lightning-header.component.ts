/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';

@Component({
	selector: 'orc-index-subsection-dashboard-lightning-header',
	standalone: false,
	templateUrl: './index-subsection-dashboard-lightning-header.component.html',
	styleUrl: './index-subsection-dashboard-lightning-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardLightningHeaderComponent {
	public enabled = input.required<boolean>();
	public loading = input.required<boolean>();
	public lightning_info = input.required<LightningInfo>();
	public device_desktop = input.required<boolean>();
}
