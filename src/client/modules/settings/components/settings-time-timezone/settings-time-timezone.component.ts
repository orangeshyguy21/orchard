/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, computed } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
/* Application Dependencies */
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
/* Vendor Dependencies */
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'orc-settings-time-timezone',
	standalone: false,
	templateUrl: './settings-time-timezone.component.html',
	styleUrl: './settings-time-timezone.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsTimeTimezoneComponent implements OnInit {

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

	constructor(
		public localStorageService: LocalStorageService,
	) { }

	ngOnInit() {
		const timezone = this.localStorageService.getTimezone();
		this.initCheckbox(timezone.tz);
		this.initTimezone(timezone.tz);
		
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
			this.saveTimezone(null);
			this.timezone_control.setValue(this.system_timezone, { emitEvent: false });
		}else{
			this.saveTimezone(this.timezone_control.value);
		}
	}

	public onTimezoneChange(value: string|null) : void {
		if( value === null ) return this.timezone_control.setErrors({ required: true });
		if (!this.timezone_options.includes(value)) return this.timezone_control.setErrors({ invalid_timezone: true });
		this.saveTimezone(value);
		if( value !== this.system_timezone ) return this.system_default_control.setValue(false);
	}

	public saveTimezone(tz: string|null) {
		this.localStorageService.setTimezone({ tz: tz });
	}
}
