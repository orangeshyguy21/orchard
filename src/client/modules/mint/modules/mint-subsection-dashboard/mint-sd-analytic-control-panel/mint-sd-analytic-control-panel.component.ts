/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
/* Vendor Dependencies */
import {MatSelectChange} from '@angular/material/select';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {NonNullableMintDashboardSettings} from '@client/modules/settings/types/setting.types';
/* Native Dependencies */
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {ChartType} from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import {MintAnalyticsInterval, MintUnit} from '@shared/generated.types';

type UnitOption = {
	label: string;
	value: MintUnit;
};
type IntervalOption = {
	label: string;
	value: MintAnalyticsInterval;
};
type TypeOption = {
	label: string;
	value: ChartType;
};

@Component({
	selector: 'orc-mint-sd-analytic-control-panel',
	standalone: false,
	templateUrl: './mint-sd-analytic-control-panel.component.html',
	styleUrl: './mint-sd-analytic-control-panel.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSDAnalyticControlPanelComponent implements OnChanges {
	@Input() page_settings!: NonNullableMintDashboardSettings;
	@Input() date_start?: number;
	@Input() date_end?: number;
	@Input() units?: MintUnit[];
	@Input() interval?: MintAnalyticsInterval;
	@Input() type?: ChartType;
	@Input() keysets!: MintKeyset[];
	@Input() loading!: boolean;
	@Input() mint_genesis_time!: number;

	@Output() dateChange = new EventEmitter<number[]>();
	@Output() unitsChange = new EventEmitter<MintUnit[]>();
	@Output() intervalChange = new EventEmitter<MintAnalyticsInterval>();
	@Output() typeChange = new EventEmitter<ChartType>();

	public readonly panel = new FormGroup({
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
		units: new FormControl<MintUnit[] | null>(null, [Validators.required]),
		interval: new FormControl<MintAnalyticsInterval | null>(null, [Validators.required]),
		type: new FormControl<ChartType | null>(null, [Validators.required]),
	});

	public unit_options!: UnitOption[];
	public interval_options: IntervalOption[] = [
		{label: 'Day', value: MintAnalyticsInterval.Day},
		{label: 'Week', value: MintAnalyticsInterval.Week},
		{label: 'Month', value: MintAnalyticsInterval.Month},
	];
	public type_options: TypeOption[] = [
		{label: 'Summary', value: ChartType.Summary},
		{label: 'Volume', value: ChartType.Volume},
		{label: 'Operations', value: ChartType.Operations},
	];
	public genesis_class: MatCalendarCellClassFunction<DateTime> = (cellDate, view) => {
		if (view !== 'month') return '';
		const unix_seconds = cellDate.toSeconds();
		const unix_next_day = unix_seconds + 86400 - 1;
		if (unix_seconds <= this.mint_genesis_time && unix_next_day >= this.mint_genesis_time) return 'mint-genesis-date-class';
		return '';
	};

	public get height_state(): string {
		return this.panel?.invalid ? 'invalid' : 'valid';
	}

	constructor() {
		this.panel
			.get('daterange')
			?.statusChanges.pipe(takeUntilDestroyed())
			.subscribe(() => {
				const group = this.panel.get('daterange');
				group?.markAllAsTouched();
			});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && !this.loading) this.initForm();
		if (
			changes['date_start'] &&
			this.date_start &&
			this.panel.controls.daterange.get('date_start')?.value?.toSeconds() !== this.date_start
		) {
			this.panel.controls.daterange.get('date_start')?.setValue(DateTime.fromSeconds(this.date_start));
		}
		if (changes['date_end'] && this.date_end && this.panel.controls.daterange.get('date_end')?.value?.toSeconds() !== this.date_end) {
			this.panel.controls.daterange.get('date_end')?.setValue(DateTime.fromSeconds(this.date_end));
		}
		if (changes['units'] && this.units && this.panel.controls.units.value !== this.units) {
			this.panel.controls.units.setValue(this.units);
		}
		if (changes['interval'] && this.interval && this.panel.controls.interval.value !== this.interval) {
			this.panel.controls.interval.setValue(this.interval);
		}
		if (changes['type'] && this.type && this.panel.controls.type.value !== this.type) {
			this.panel.controls.type.setValue(this.type);
		}
	}

	private initForm(): void {
		const unique_units = Array.from(new Set(this.keysets.map((keyset) => keyset.unit)));
		this.unit_options = unique_units.map((unit) => ({label: unit.toUpperCase(), value: unit}));
		this.panel.controls.daterange.controls.date_start.setValue(DateTime.fromSeconds(this.page_settings.date_start));
		this.panel.controls.daterange.controls.date_end.setValue(DateTime.fromSeconds(this.page_settings.date_end));
		this.panel.controls.units.setValue(this.page_settings.units);
		this.panel.controls.interval.setValue(this.page_settings.interval);
		this.panel.controls.type.setValue(this.page_settings.type);
	}

	public onDateChange(): void {
		if (this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		if (this.panel.controls.daterange.controls.date_start.value === null) return;
		if (this.panel.controls.daterange.controls.date_end.value === null) return;
		const date_start = Math.floor(this.panel.controls.daterange.controls.date_start.value.toSeconds());
		const date_end = Math.floor(this.panel.controls.daterange.controls.date_end.value.endOf('day').toSeconds());
		this.dateChange.emit([date_start, date_end]);
	}

	public onTest(): void {
		console.log('onTest');
	}

	public onUnitsChange(event: MatSelectChange): void {
		if (this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		this.unitsChange.emit(event.value);
	}

	public onIntervalChange(event: MatSelectChange): void {
		if (this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		this.intervalChange.emit(event.value);
	}

	public onTypeChange(event: MatSelectChange): void {
		if (this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		this.typeChange.emit(event.value);
	}

	private isValidChange(): boolean {
		// validations
		if (this.panel.controls.daterange.controls.date_start.value === null) return false;
		if (this.panel.controls.daterange.controls.date_end.value === null) return false;
		if (this.panel.controls.units.value === null) return false;
		if (this.panel.controls.interval.value === null) return false;
		if (this.panel.controls.type.value === null) return false;
		// change checks
		if (this.panel.controls.daterange.controls.date_start.value.toSeconds() !== this.page_settings.date_start) return true;
		if (this.panel.controls.daterange.controls.date_end.value.toSeconds() !== this.page_settings.date_end) return true;
		if (this.panel.controls.units.value !== this.page_settings.units) return true;
		if (this.panel.controls.interval.value !== this.page_settings.interval) return true;
		if (this.panel.controls.type.value !== this.page_settings.type) return true;
		return false;
	}
}
