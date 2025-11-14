/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-control',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-control.component.html',
	styleUrl: './bitcoin-subsection-oracle-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleControlComponent {
	public form_group = input.required<FormGroup>();
}
