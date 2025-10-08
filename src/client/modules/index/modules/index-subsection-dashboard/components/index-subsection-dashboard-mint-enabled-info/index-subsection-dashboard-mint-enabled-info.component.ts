/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Application Dependencies */
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';

@Component({
	selector: 'orc-index-subsection-dashboard-mint-enabled-info',
	standalone: false,
	templateUrl: './index-subsection-dashboard-mint-enabled-info.component.html',
	styleUrl: './index-subsection-dashboard-mint-enabled-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardMintEnabledInfoComponent {
	@Input() loading!: boolean;
	@Input() icon_data!: string | null;
	@Input() info!: MintInfo | null;
}
