/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'orc-index-subsection-dashboard-mint-disabled',
	standalone: false,
	templateUrl: './index-subsection-dashboard-mint-disabled.component.html',
	styleUrl: './index-subsection-dashboard-mint-disabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardMintDisabledComponent {
	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();
}
