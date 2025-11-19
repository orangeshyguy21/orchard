/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal, computed} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Native Dependencies */
import {BackfillOracleControl} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/types/backfill-oracle-control.type';
import {BitcoinOracleBackfillProgress} from '@client/modules/bitcoin/classes/bitcoin-oracle-backfill-progress.class';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-form',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-form.component.html',
	styleUrl: './bitcoin-subsection-oracle-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleFormComponent {
	public form_group = input.required<FormGroup>();
	public running = input.required<boolean>();
	public progress = input.required<BitcoinOracleBackfillProgress | null>();
	public min_date = input.required<DateTime>();
	public max_date = input.required<DateTime>();
	public date_start_max = input.required<DateTime>();
	public date_end_min = input.required<DateTime>();

	public close = output<void>();
	public cancel = output<BackfillOracleControl>();

	public focused_date_start = signal<boolean>(false);
	public focused_date_end = signal<boolean>(false);
}
