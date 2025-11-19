/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-run-progress-date',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-run-progress-date.component.html',
	styleUrl: './bitcoin-subsection-oracle-run-progress-date.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleRunProgressDateComponent {
	public message = input<string>('');
	public progress = input.required<number | null>();
}
