/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, computed} from '@angular/core';
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
	@Input() enabled!: boolean;
	@Input() loading!: boolean;
	@Input() info!: MintInfo;
	@Input() error!: boolean;

	public state = computed(() => {
		if (this.error) return 'offline';
		return 'online';
	});
}
