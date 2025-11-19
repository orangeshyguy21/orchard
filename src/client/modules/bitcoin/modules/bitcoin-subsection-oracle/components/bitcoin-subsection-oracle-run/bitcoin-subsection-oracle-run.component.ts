/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Native Dependencies */
import {BitcoinOracleBackfillProgress} from '@client/modules/bitcoin/classes/bitcoin-oracle-backfill-progress.class';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-run',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-run.component.html',
	styleUrl: './bitcoin-subsection-oracle-run.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleRunComponent {
	public date_start = input.required<DateTime>();
	public date_end = input.required<DateTime>();
	public running = input.required<boolean>();
	public progress = input.required<BitcoinOracleBackfillProgress | null>();

	public date_start_stamp = computed(() => {
		return Math.floor(this.date_start()?.toSeconds() ?? 0);
	});
	public date_end_stamp = computed(() => {
		return Math.floor(this.date_end()?.toSeconds() ?? 0);
	});
	public reveal_dates = computed(() => {
		return this.date_start() !== null;
	});
	public reveal_progress = computed(() => {
		return this.progress() !== null;
	});
}
