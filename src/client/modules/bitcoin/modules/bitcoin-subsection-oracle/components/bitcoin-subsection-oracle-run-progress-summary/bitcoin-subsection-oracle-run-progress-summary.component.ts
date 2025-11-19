/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-run-progress-summary',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-run-progress-summary.component.html',
	styleUrl: './bitcoin-subsection-oracle-run-progress-summary.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleRunProgressSummaryComponent {
	public date = input.required<number>();
	public progress = input.required<number>();
	public successful = input.required<number>();
	public failed = input.required<number>();
}
