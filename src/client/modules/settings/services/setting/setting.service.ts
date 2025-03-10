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

	getLocale(): string {
		return this.localStorageService.getLocale().code ?? Intl.DateTimeFormat().resolvedOptions().locale;
	}

	getTimezone(): string {
		return this.localStorageService.getTimezone().tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	async setLocale(locale: string): Promise<void> {
		const local_module = await this.importLocale(locale);
		this.dateAdapter.setLocale(local_module);
	}

	private async importLocale(locale_key: string): Promise<any> {
		try {
			const module = await import(`date-fns/locale/${locale_key}`);
			return module.default;
		} catch (error) {
			const fallback = await import('date-fns/locale/en-US');
			return fallback.default;
		}
	}
}

