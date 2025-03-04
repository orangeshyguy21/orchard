/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, computed } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
/* Application Dependencies */
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
/* Vendor Dependencies */
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
	selector: 'orc-settings-time-locale',
	standalone: false,
	templateUrl: './settings-time-locale.component.html',
	styleUrl: './settings-time-locale.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsTimeLocaleComponent implements OnInit {

	public locale_control = new FormControl('', [Validators.required]);
	public system_default_control = new FormControl(true);
	public unix_timestamp_seconds = Math.floor(Date.now() / 1000);
	public locale_options = [
		// English Variants
		{ code: 'en-US', country: 'English (United States)' },
		{ code: 'en-GB', country: 'English (United Kingdom)' },
		{ code: 'en-CA', country: 'English (Canada)' },
		{ code: 'en-AU', country: 'English (Australia)' },
		{ code: 'en-NZ', country: 'English (New Zealand)' },
		{ code: 'en-IE', country: 'English (Ireland)' },
		
		// European Languages
		{ code: 'de-DE', country: 'German (Germany)' },
		{ code: 'fr-FR', country: 'French (France)' },
		{ code: 'es-ES', country: 'Spanish (Spain)' },
		{ code: 'it-IT', country: 'Italian (Italy)' },
		{ code: 'pt-PT', country: 'Portuguese (Portugal)' },
		{ code: 'nl-NL', country: 'Dutch (Netherlands)' },
		{ code: 'sv-SE', country: 'Swedish (Sweden)' },
		{ code: 'fi-FI', country: 'Finnish (Finland)' },
		{ code: 'da-DK', country: 'Danish (Denmark)' },
		{ code: 'no-NO', country: 'Norwegian (Norway)' },
		{ code: 'pl-PL', country: 'Polish (Poland)' },
		{ code: 'ru-RU', country: 'Russian (Russia)' },
		
		// Asian Languages
		{ code: 'ja-JP', country: 'Japanese (Japan)' },
		{ code: 'zh-CN', country: 'Chinese (China)' },
		{ code: 'zh-TW', country: 'Chinese (Taiwan)' },
		{ code: 'ko-KR', country: 'Korean (South Korea)' },
		{ code: 'th-TH', country: 'Thai (Thailand)' },
		{ code: 'vi-VN', country: 'Vietnamese (Vietnam)' },
		
		// Latin American Spanish Variants
		{ code: 'es-MX', country: 'Spanish (Mexico)' },
		{ code: 'es-AR', country: 'Spanish (Argentina)' },
		{ code: 'es-CL', country: 'Spanish (Chile)' },
		{ code: 'es-CO', country: 'Spanish (Colombia)' },
		
		// Middle East/North Africa
		{ code: 'ar-SA', country: 'Arabic (Saudi Arabia)' },
		{ code: 'ar-EG', country: 'Arabic (Egypt)' },
		{ code: 'he-IL', country: 'Hebrew (Israel)' },
		{ code: 'tr-TR', country: 'Turkish (Turkey)' },
		
		// Other Notable Locales
		{ code: 'pt-BR', country: 'Portuguese (Brazil)' },
		{ code: 'hi-IN', country: 'Hindi (India)' },
		{ code: 'bn-IN', country: 'Bengali (India)' },
		{ code: 'id-ID', country: 'Indonesian (Indonesia)' }
	];

	private system_locale = Intl.DateTimeFormat().resolvedOptions().locale;

	constructor(
		public localStorageService: LocalStorageService,
	) { }

	ngOnInit() {
		const locale = this.localStorageService.getLocale();
		this.initLocale(locale.code);
		this.initCheckbox(locale.code);

		this.locale_control.valueChanges.subscribe(value => {
			this.onLocaleChange(value);
		});
	}

	

	private initCheckbox(code: string|null) {
		const is_system_default = (code === null) ? true : false;
		this.system_default_control.setValue(is_system_default);
	}

	private initLocale(code: string|null) {
		const display_code = (code === null) ? navigator.language : code;
		this.locale_control.setValue(display_code);
	}

	public onSystemDefaultChange(event: MatCheckboxChange) {
		if( event.checked ) {
			this.saveLocale(null);
			this.locale_control.setValue(navigator.language, { emitEvent: false });
		}else{
			this.saveLocale(this.locale_control.value);
		}
	}


	public onLocaleChange(value: string|null) : void {
		this.saveLocale(value);
		if( value !== this.system_locale ) return this.system_default_control.setValue(false);
	}

	public saveLocale(code: string|null) {
		this.localStorageService.setLocale({ code: code });
	}

}
