/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, OnChanges, Output, signal, SimpleChanges, EventEmitter, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatAutocompleteTrigger, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
/* Application Dependencies */
import {Locale} from '@client/modules/cache/services/local-storage/local-storage.types';

type LocaleOption = {
	code: string;
	country: string;
};

@Component({
	selector: 'orc-settings-subsection-device-time-locale',
	standalone: false,
	templateUrl: './settings-subsection-device-time-locale.component.html',
	styleUrl: './settings-subsection-device-time-locale.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionDeviceTimeLocaleComponent implements OnChanges {
	@ViewChild(MatAutocompleteTrigger) autotrigger!: MatAutocompleteTrigger;
	@ViewChild(MatAutocomplete) auto!: MatAutocomplete;

	@Input() locale!: Locale | null;
	@Input() loading!: boolean;

	@Output() localeChange = new EventEmitter<string | null>();

	public locale_control = new FormControl('', [Validators.required]);
	public system_default_control = new FormControl(true);
	public unix_timestamp_seconds = Math.floor(Date.now() / 1000);
	public example_amount = 1000000;
	public filtered_options!: Observable<LocaleOption[]>;
	public help_status = signal<boolean>(false);
	public locale_options: LocaleOption[] = [
		// English Variants
		{code: 'en-US', country: 'English (United States)'},
		{code: 'en-GB', country: 'English (United Kingdom)'},
		{code: 'en-CA', country: 'English (Canada)'},
		{code: 'en-AU', country: 'English (Australia)'},
		{code: 'en-NZ', country: 'English (New Zealand)'},
		{code: 'en-IE', country: 'English (Ireland)'},

		// European Languages
		{code: 'de-DE', country: 'German (Germany)'},
		{code: 'fr-FR', country: 'French (France)'},
		{code: 'es-ES', country: 'Spanish (Spain)'},
		{code: 'it-IT', country: 'Italian (Italy)'},
		{code: 'pt-PT', country: 'Portuguese (Portugal)'},
		{code: 'nl-NL', country: 'Dutch (Netherlands)'},
		{code: 'sv-SE', country: 'Swedish (Sweden)'},
		{code: 'fi-FI', country: 'Finnish (Finland)'},
		{code: 'da-DK', country: 'Danish (Denmark)'},
		{code: 'no-NO', country: 'Norwegian (Norway)'},
		{code: 'pl-PL', country: 'Polish (Poland)'},
		{code: 'ru-RU', country: 'Russian (Russia)'},

		// Asian Languages
		{code: 'ja-JP', country: 'Japanese (Japan)'},
		{code: 'zh-CN', country: 'Chinese (China)'},
		{code: 'zh-TW', country: 'Chinese (Taiwan)'},
		{code: 'ko-KR', country: 'Korean (South Korea)'},
		{code: 'th-TH', country: 'Thai (Thailand)'},
		{code: 'vi-VN', country: 'Vietnamese (Vietnam)'},

		// Latin American Spanish Variants
		{code: 'es-MX', country: 'Spanish (Mexico)'},
		{code: 'es-AR', country: 'Spanish (Argentina)'},
		{code: 'es-CL', country: 'Spanish (Chile)'},
		{code: 'es-CO', country: 'Spanish (Colombia)'},

		// Middle East/North Africa
		{code: 'ar-SA', country: 'Arabic (Saudi Arabia)'},
		{code: 'ar-EG', country: 'Arabic (Egypt)'},
		{code: 'he-IL', country: 'Hebrew (Israel)'},
		{code: 'tr-TR', country: 'Turkish (Turkey)'},

		// Other Notable Locales
		{code: 'pt-BR', country: 'Portuguese (Brazil)'},
		{code: 'hi-IN', country: 'Hindi (India)'},
		{code: 'bn-IN', country: 'Bengali (India)'},
		{code: 'id-ID', country: 'Indonesian (Indonesia)'},
	];

	private system_locale = Intl.DateTimeFormat().resolvedOptions().locale;

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && this.loading === false) this.init();
	}

	private init() {
		if (this.locale === null) return;
		this.initLocale(this.locale?.code);
		this.initCheckbox(this.locale?.code);
		this.setFilteredOptions();
		setTimeout(() => {
			this.auto.options.find((option) => option.value === this.locale?.code)?.select();
		});
		this.locale_control.valueChanges.subscribe((value) => {
			this.onLocaleChange(value);
		});
	}

	private setFilteredOptions() {
		this.filtered_options = this.locale_control.valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value || '')),
		);
	}

	private _filter(value: string): LocaleOption[] {
		const filter_value = value.toLowerCase();
		if (filter_value === this.locale?.code) return this.locale_options;
		return this.locale_options.filter((option) => option.country.toLowerCase().includes(filter_value));
	}

	private initCheckbox(code: string | null) {
		const is_system_default = code === null ? true : false;
		this.system_default_control.setValue(is_system_default);
	}

	private initLocale(code: string | null) {
		const display_code = code === null ? navigator.language : code;
		this.locale_control.setValue(display_code);
	}

	public onSystemDefaultChange(event: MatCheckboxChange) {
		if (event.checked) {
			this.localeChange.emit(null);
			this.locale_control.setValue(navigator.language, {emitEvent: false});
		} else {
			this.localeChange.emit(this.locale_control.value);
		}
	}

	public onLocaleChange(value: string | null): void {
		if (value === null || value === '') return this.locale_control.setErrors({required: true});
		if (!this.locale_options.some((option) => option.code === value)) return this.locale_control.setErrors({invalid_locale: true});
		this.localeChange.emit(value);
		if (value !== this.system_locale) this.system_default_control.setValue(false);
		this.setFilteredOptions();
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.autotrigger.closePanel();
		this.onLocaleChange(this.locale_control.value);
		setTimeout(() => {
			this.auto.options.find((option) => option.value === this.locale?.code)?.select();
		});
	}
}
