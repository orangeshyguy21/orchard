/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Vendor Dependencies */
import { DateAdapter } from '@angular/material/core';
import { Settings } from 'luxon';
/* Application Dependencies */
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
import { ThemeType } from '@client/modules/cache/services/local-storage/local-storage.types';

@Injectable({
	providedIn: 'root'
})
export class SettingService {

	constructor(
		private dateAdapter: DateAdapter<Date>,
		private localStorageService: LocalStorageService,
	) { }

	public getLocale(): string {
		const system_locale = Intl.DateTimeFormat().resolvedOptions().locale;
		return this.localStorageService.getLocale().code ?? system_locale;
	}

	public getTimezone(): string {
		const system_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return this.localStorageService.getTimezone().tz ?? system_timezone;
	}

	public getTheme(): ThemeType {
		const prefers_light_theme = window.matchMedia('(prefers-color-scheme: light)').matches;
		const theme = this.localStorageService.getTheme();
		if( theme.type === null ) return prefers_light_theme ? ThemeType.LIGHT_MODE : ThemeType.DARK_MODE;
		return theme.type
	}

	public init(): void {
		this.setLocale();
		this.setTimezone();
		this.setTheme();
	}

	public setLocale(): void {
		const locale = this.getLocale();
		this.dateAdapter.setLocale(locale);
		Settings.defaultLocale = locale;
	}

	public setTimezone(): void {
		const timezone = this.getTimezone();
		Settings.defaultZone = timezone;
	}

	public setTheme(): void {
		const theme = this.getTheme();
		if( theme === null ) return document.body.classList.remove(ThemeType.LIGHT_MODE, ThemeType.DARK_MODE);
		document.body.classList.remove(ThemeType.LIGHT_MODE, ThemeType.DARK_MODE);
		document.body.classList.add(theme);
	}
}

