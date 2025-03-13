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
		return this.localStorageService.getLocale().code ?? Intl.DateTimeFormat().resolvedOptions().locale;
	}

	public getTimezone(): string {
		return this.localStorageService.getTimezone().tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	public getTheme(): ThemeType | null {
		return this.localStorageService.getTheme().type ?? null;
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

