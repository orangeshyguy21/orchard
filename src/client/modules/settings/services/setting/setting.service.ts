/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Application Dependencies */
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
/* Vendor Dependencies */
import { DateAdapter } from '@angular/material/core';

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

	public async setLocale(locale: string): Promise<void> {
		this.dateAdapter.setLocale(locale);
	}
}

