/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Shared Dependencies */
import {UtxOracleProgressStatus} from '@shared/generated.types';

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
	public status = input.required<UtxOracleProgressStatus | null>();

	public UtxOracleProgressStatus = UtxOracleProgressStatus;

	public progress_displayed = computed(() => {
		const progress = this.progress();
		const status = this.status();
		if (progress === null) return 0;
		if (progress) return progress;
		if (status === UtxOracleProgressStatus.Completed) return 100;
		return progress;
	});
}
