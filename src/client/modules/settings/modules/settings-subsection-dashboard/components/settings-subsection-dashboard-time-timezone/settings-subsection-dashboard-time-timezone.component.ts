/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	computed,
	ViewChild,
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatAutocompleteTrigger, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
/* Application Dependencies */
import {Timezone} from '@client/modules/cache/services/local-storage/local-storage.types';

@Component({
	selector: 'orc-settings-subsection-dashboard-time-timezone',
	standalone: false,
	templateUrl: './settings-subsection-dashboard-time-timezone.component.html',
	styleUrl: './settings-subsection-dashboard-time-timezone.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionDashboardTimeTimezoneComponent implements OnChanges {
	@ViewChild(MatAutocompleteTrigger) autotrigger!: MatAutocompleteTrigger;
	@ViewChild(MatAutocomplete) auto!: MatAutocomplete;

	@Input() timezone!: Timezone | null;
	@Input() loading!: boolean;

	@Output() timezoneChange = new EventEmitter<string | null>();

	public timezone_control = new FormControl('', [Validators.required]);
	public system_default_control = new FormControl(true);
	public timezone_options: string[] = (Intl as any).supportedValuesOf('timeZone');
	public filtered_options!: Observable<string[]>;
	public unix_timestamp_seconds = Math.floor(Date.now() / 1000);

	private system_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	public timezone_control_error = computed(() => {
		if (this.timezone_control.hasError('required')) return 'required';
		if (this.timezone_control.hasError('invalid_timezone')) return 'invalid timezone';
		return '';
	});

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && this.loading === false) this.init();
	}

	private init() {
		if (this.timezone === null) return;
		this.initCheckbox(this.timezone?.tz);
		this.initTimezone(this.timezone?.tz);
		this.setFilteredOptions();
		setTimeout(() => {
			this.auto.options.find((option) => option.value === this.timezone?.tz)?.select();
		});
		this.timezone_control.valueChanges.subscribe((value) => {
			this.onTimezoneChange(value);
		});
	}

	private setFilteredOptions() {
		this.filtered_options = this.timezone_control.valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value || '')),
		);
	}

	private initCheckbox(tz: string | null) {
		const is_system_default = tz === null ? true : false;
		this.system_default_control.setValue(is_system_default);
	}

	private initTimezone(tz: string | null) {
		const display_tz = tz === null ? this.system_timezone : tz;
		this.timezone_control.setValue(display_tz);
	}

	private _filter(value: string): string[] {
		const filter_value = value.toLowerCase();
		if (filter_value === this.timezone?.tz) return this.timezone_options;
		return this.timezone_options.filter((option) => option.toLowerCase().includes(filter_value));
	}

	public onSystemDefaultChange(event: MatCheckboxChange) {
		if (event.checked) {
			this.timezoneChange.emit(null);
			this.timezone_control.setValue(this.system_timezone, {emitEvent: false});
		} else {
			this.timezoneChange.emit(this.timezone_control.value);
		}
	}

	public onTimezoneChange(value: string | null): void {
		if (value === null) return this.timezone_control.setErrors({required: true});
		if (!this.timezone_options.includes(value)) return this.timezone_control.setErrors({invalid_timezone: true});
		this.timezoneChange.emit(value);
		if (value !== this.system_timezone) this.system_default_control.setValue(false);
		this.setFilteredOptions();
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.autotrigger.closePanel();
		this.onTimezoneChange(this.timezone_control.value);
		setTimeout(() => {
			this.auto.options.find((option) => option.value === this.timezone?.tz)?.select();
		});
	}
}
