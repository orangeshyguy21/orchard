/* Core Dependencies */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
/* Vendor Dependencies */
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
/* Application Dependencies */
import { Timezone } from '@client/modules/cache/services/local-storage/local-storage.types';

@Component({
	selector: 'orc-settings-time-timezone',
	standalone: false,
	templateUrl: './settings-time-timezone.component.html',
	styleUrl: './settings-time-timezone.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsTimeTimezoneComponent implements OnChanges {

	@Input() timezone!: Timezone | null;
	@Input() loading!: boolean;

	@Output() timezoneChange = new EventEmitter<string|null>();

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

	constructor() { }

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) this.init();
	}

	private init() {
		if( this.timezone === null ) return;
		this.initCheckbox(this.timezone?.tz);
		this.initTimezone(this.timezone?.tz);
		
		this.filtered_options = this.timezone_control.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value || '')),
		);

		this.timezone_control.valueChanges.subscribe(value => {
			this.onTimezoneChange(value);
		});
	}

	private initCheckbox(tz: string|null) {
		const is_system_default = (tz === null) ? true : false;
		this.system_default_control.setValue(is_system_default);
	}

	private initTimezone(tz: string|null) {
		const display_tz = (tz === null) ? this.system_timezone : tz;
		this.timezone_control.setValue(display_tz);
	}

	private _filter(value: string): string[] {
		const filter_value = value.toLowerCase();
		return this.timezone_options.filter(option => option.toLowerCase().includes(filter_value));
	}

	public onSystemDefaultChange(event: MatCheckboxChange) {
		if( event.checked ) {
			this.timezoneChange.emit(null);
			this.timezone_control.setValue(this.system_timezone, { emitEvent: false });
		}else{
			this.timezoneChange.emit(this.timezone_control.value);
		}
	}

	public onTimezoneChange(value: string|null) : void {
		if( value === null ) return this.timezone_control.setErrors({ required: true });
		if (!this.timezone_options.includes(value)) return this.timezone_control.setErrors({ invalid_timezone: true });
		this.timezoneChange.emit(value);
		if( value !== this.system_timezone ) return this.system_default_control.setValue(false);
	}
}
