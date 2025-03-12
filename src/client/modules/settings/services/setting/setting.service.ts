/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Vendor Dependencies */
import { DateAdapter } from '@angular/material/core';
import { Settings } from 'luxon';
/* Application Dependencies */
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';

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

	public init(): void {
		this.setLocale();
		this.setTimezone();
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
}

