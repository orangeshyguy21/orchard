/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-control',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-control.component.html',
	styleUrl: './bitcoin-subsection-oracle-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleControlComponent {
	public form_group = input.required<FormGroup>();
	// First valid date: July 27th, 2020 UTC
	public min_date = signal<DateTime>(DateTime.utc(2020, 7, 27).startOf('day'));
	// Current date: today UTC
	public max_date = signal<DateTime>(DateTime.utc().endOf('day'));
}
