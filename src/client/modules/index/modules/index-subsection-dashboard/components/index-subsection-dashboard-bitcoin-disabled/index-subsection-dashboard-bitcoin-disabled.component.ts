/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'orc-index-subsection-dashboard-bitcoin-disabled',
	standalone: false,
	templateUrl: './index-subsection-dashboard-bitcoin-disabled.component.html',
	styleUrl: './index-subsection-dashboard-bitcoin-disabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardBitcoinDisabledComponent {
	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();
}
