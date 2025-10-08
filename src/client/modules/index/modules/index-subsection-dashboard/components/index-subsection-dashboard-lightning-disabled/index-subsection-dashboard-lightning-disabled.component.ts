/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'orc-index-subsection-dashboard-lightning-disabled',
	standalone: false,
	templateUrl: './index-subsection-dashboard-lightning-disabled.component.html',
	styleUrl: './index-subsection-dashboard-lightning-disabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardLightningDisabledComponent {
	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();
}
