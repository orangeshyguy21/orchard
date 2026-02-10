/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Application Dependencies */
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';

@Component({
	selector: 'orc-index-subsection-dashboard-mint-header',
	standalone: false,
	templateUrl: './index-subsection-dashboard-mint-header.component.html',
	styleUrl: './index-subsection-dashboard-mint-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardMintHeaderComponent {
	public enabled = input<boolean>();
	public loading = input<boolean>();
	public info = input<MintInfo>();
	public device_desktop = input<boolean>();
}
