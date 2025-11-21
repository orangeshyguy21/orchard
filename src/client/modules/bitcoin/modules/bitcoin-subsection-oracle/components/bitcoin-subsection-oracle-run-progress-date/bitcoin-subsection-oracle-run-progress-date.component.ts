/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Shared Dependencies */
import {UtxOracleProgressStatus} from '@shared/generated.types';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-run-progress-date',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-run-progress-date.component.html',
	styleUrl: './bitcoin-subsection-oracle-run-progress-date.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleRunProgressDateComponent {
	public message = input.required<string | null>();
	public progress = input.required<number | null>();
	public error = input.required<string | null>();
	public status = input.required<UtxOracleProgressStatus | null>();

	public message_displayed = computed(() => {
		const message = this.message();
		const status = this.status();
		if (message) return message;
		if (status === UtxOracleProgressStatus.Error) return this.error();
		if (status === UtxOracleProgressStatus.Aborted) return 'Aborted';
		if (status === UtxOracleProgressStatus.Completed) return 'Completed';
		if (status === UtxOracleProgressStatus.Processing) return 'Processing';
		if (status === UtxOracleProgressStatus.Started) return 'Starting...';
		return 'Starting...';
	});

	public progress_displayed = computed(() => {
		const progress = this.progress();
		const status = this.status();
		if (progress === null) return 0;
		if (progress) return progress;
		if (status === UtxOracleProgressStatus.Completed) return 100;
		return progress;
	});

	public UtxOracleProgressStatus = UtxOracleProgressStatus;
}
