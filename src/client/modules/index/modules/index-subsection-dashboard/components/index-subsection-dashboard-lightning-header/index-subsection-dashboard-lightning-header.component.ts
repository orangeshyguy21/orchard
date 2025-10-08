/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, computed} from '@angular/core';
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
	@Input() enabled!: boolean;
	@Input() loading!: boolean;
	@Input() lightning_info!: LightningInfo;
	@Input() error!: boolean;

	public state = computed(() => {
		if (this.error) return 'offline';
		if (!this.lightning_info?.synced_to_chain || !this.lightning_info?.synced_to_graph) return 'syncing';
		return 'online';
	});
}
