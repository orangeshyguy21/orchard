/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Native Dependencies */
import {BackfillOracleControl} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/types/backfill-oracle-control.type';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-form',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-form.component.html',
	styleUrl: './bitcoin-subsection-oracle-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleFormComponent {
	public form_group = input.required<FormGroup>();
	public active = input.required<boolean>();

	public close = output<void>();
	public cancel = output<BackfillOracleControl>();

	public focused_date_start = signal<boolean>(false);
	public focused_date_end = signal<boolean>(false);
}
