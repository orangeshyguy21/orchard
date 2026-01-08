/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, viewChild, signal} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
/* Vendor Dependencies */
import {MatSelectChange} from '@angular/material/select';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {DateTime} from 'luxon';
import {MatMenuTrigger} from '@angular/material/menu';
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
	selector: 'orc-mint-subsection-dashboard-control',
	standalone: false,
	templateUrl: './mint-subsection-dashboard-control.component.html',
	styleUrl: './mint-subsection-dashboard-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDashboardControlComponent implements OnChanges {
	@Input() page_settings!: NonNullableMintDashboardSettings;
	@Input() date_start?: number;
	@Input() date_end?: number;
	@Input() units?: MintUnit[];
	@Input() interval?: MintAnalyticsInterval;
	@Input() keysets!: MintKeyset[];
	@Input() loading!: boolean;
	@Input() mint_genesis_time!: number;

	@Output() dateChange = new EventEmitter<number[]>();
	@Output() unitsChange = new EventEmitter<MintUnit[]>();
	@Output() intervalChange = new EventEmitter<MintAnalyticsInterval>();

	public filter_count = signal(0);

	public readonly panel = new FormGroup({
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
		units: new FormArray<FormControl<boolean>>([]),
		interval: new FormControl<MintAnalyticsInterval | null>(null, [Validators.required]),
	});

	public unit_options!: UnitOption[];
	public interval_options: IntervalOption[] = [
		{label: 'Day', value: MintAnalyticsInterval.Day},
		{label: 'Week', value: MintAnalyticsInterval.Week},
		{label: 'Month', value: MintAnalyticsInterval.Month},
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

	private filter_menu_trigger = viewChild(MatMenuTrigger);

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
		if (changes['units'] && this.units && !this.areUnitsEqual(this.getSelectedUnits(), this.units)) {
			this.setUnitFilters(this.units);
		}
		if (changes['interval'] && this.interval && this.panel.controls.interval.value !== this.interval) {
			this.panel.controls.interval.setValue(this.interval);
		}
	}

	private initForm(): void {
		const unique_units = Array.from(new Set(this.keysets.map((keyset) => keyset.unit)));
		this.unit_options = unique_units.map((unit) => ({label: unit.toUpperCase(), value: unit}));
		this.buildUnitFilters();
		this.panel.controls.daterange.controls.date_start.setValue(DateTime.fromSeconds(this.page_settings.date_start));
		this.panel.controls.daterange.controls.date_end.setValue(DateTime.fromSeconds(this.page_settings.date_end));
		this.setUnitFilters(this.page_settings.units);
		this.panel.controls.interval.setValue(this.page_settings.interval);
	}

	/** Builds the FormArray controls based on unit_options */
	private buildUnitFilters(): void {
		this.panel.controls.units.clear();
		this.unit_options.forEach(() => {
			this.panel.controls.units.push(new FormControl(false, {nonNullable: true}));
		});
	}

	/** Sets the FormArray values based on selected units */
	private setUnitFilters(selected_units: MintUnit[]): void {
		this.unit_options.forEach((option, index) => {
			const is_selected = selected_units.includes(option.value);
			this.panel.controls.units.at(index).setValue(is_selected);
		});
	}

	/** Gets the selected units from the FormArray */
	public getSelectedUnits(): MintUnit[] {
		if (!this.unit_options) return [];
		return this.unit_options.filter((_, index) => this.panel.controls.units.at(index).value).map((option) => option.value);
	}

	/** Compares two unit arrays for equality */
	private areUnitsEqual(a: MintUnit[], b: MintUnit[]): boolean {
		if (a.length !== b.length) return false;
		const sorted_a = [...a].sort();
		const sorted_b = [...b].sort();
		return sorted_a.every((unit, index) => unit === sorted_b[index]);
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

	public onUnitsChange(): void {
		const selected_units = this.getSelectedUnits();
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		this.filter_count.set(selected_units.length > 0 ? 1 : 0);
		this.unitsChange.emit(selected_units);
	}

	public onIntervalChange(event: MatSelectChange): void {
		if (this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		this.intervalChange.emit(event.value);
	}

	private isValidChange(): boolean {
		// validations
		if (this.panel.controls.daterange.controls.date_start.value === null) return false;
		if (this.panel.controls.daterange.controls.date_end.value === null) return false;
		if (this.panel.controls.interval.value === null) return false;
		// change checks
		if (this.panel.controls.daterange.controls.date_start.value.toSeconds() !== this.page_settings.date_start) return true;
		if (this.panel.controls.daterange.controls.date_end.value.toSeconds() !== this.page_settings.date_end) return true;
		if (!this.areUnitsEqual(this.getSelectedUnits(), this.page_settings.units)) return true;
		if (this.panel.controls.interval.value !== this.page_settings.interval) return true;
		return false;
	}

	public onClearFilter(): void {
		this.unitsChange.emit([]);
		this.filter_count.set(0);
		this.filter_menu_trigger()?.closeMenu();
	}

	public onCloseFilter(): void {
		this.filter_menu_trigger()?.closeMenu();
	}
}
