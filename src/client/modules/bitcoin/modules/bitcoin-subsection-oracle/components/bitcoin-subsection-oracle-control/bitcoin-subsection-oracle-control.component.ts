/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {DateRange} from '@angular/material/datepicker';
/* Application Dependencies */
import {DateRangePreset} from '@client/modules/form/types/form-daterange.types';
import {DeviceType} from '@client/modules/layout/types/device.types';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-control',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-control.component.html',
	styleUrl: './bitcoin-subsection-oracle-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleControlComponent {
	public readonly form_group = input.required<FormGroup>();
	public readonly min_date = input.required<DateTime>();
	public readonly max_date = input.required<DateTime>();
	public readonly device_type = input.required<DeviceType>();
	public readonly date_preset = input<DateRangePreset | null>(null);

	public readonly presetChange = output<DateRangePreset>();
	public readonly dateRangeChange = output<DateRange<DateTime>>();
	public readonly dateInputChange = output<[number, number]>();

	/** Emits date range timestamps when manual text input produces valid dates */
	public onDateInputChange(): void {
		const ds: DateTime | null = this.form_group().get('daterange')?.get('date_start')?.value;
		const de: DateTime | null = this.form_group().get('daterange')?.get('date_end')?.value;
		if (!ds || !de) return;
		this.dateInputChange.emit([Math.floor(ds.toUTC().startOf('day').toSeconds()), Math.floor(de.toUTC().startOf('day').toSeconds())]);
	}
}
