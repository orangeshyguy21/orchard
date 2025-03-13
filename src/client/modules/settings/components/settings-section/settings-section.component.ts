/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { Locale, Timezone, Theme, ThemeType } from '@client/modules/cache/services/local-storage/local-storage.types';

@Component({
	selector: 'orc-settings-section',
	standalone: false,
	templateUrl: './settings-section.component.html',
	styleUrl: './settings-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSectionComponent implements OnInit {

	public version = environment.mode.version;
	public loading: boolean = true;
	public locale: Locale | null = null;
	public timezone: Timezone | null = null;
	public theme: Theme | null = null;


	constructor(
		private localStorageService: LocalStorageService,
		private settingService: SettingService,
		private changeDetectorRef: ChangeDetectorRef,
	) {}

	ngOnInit(): void {
		this.locale = this.localStorageService.getLocale();
		this.timezone = this.localStorageService.getTimezone();
		this.theme = this.localStorageService.getTheme();
		this.loading = false;
		this.changeDetectorRef.detectChanges();
	}

	public onLocaleChange(locale: string|null) {
		this.localStorageService.setLocale({ code: locale });
		this.settingService.setLocale();
		this.locale = this.localStorageService.getLocale();
	}

	public onTimezoneChange(timezone: string|null) {
		this.localStorageService.setTimezone({ tz: timezone });
		this.settingService.setTimezone();
		this.timezone = this.localStorageService.getTimezone();
	}

	public onThemeChange(theme: ThemeType|null) {
		console.log(theme);
		this.localStorageService.setTheme({ type: theme });
		this.settingService.setTheme();
		this.theme = this.localStorageService.getTheme();
	}
}