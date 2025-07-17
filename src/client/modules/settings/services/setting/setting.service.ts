/* Core Dependencies */
import {Injectable} from '@angular/core';
/* Vendor Dependencies */
import {DateAdapter} from '@angular/material/core';
import {Settings} from 'luxon';
/* Application Dependencies */
import {LocalStorageService} from '@client/modules/cache/services/local-storage/local-storage.service';
import {ThemeType} from '@client/modules/cache/services/local-storage/local-storage.types';
import {AllMintDashboardSettings, AllMintDatabaseSettings, AllMintKeysetsSettings} from '@client/modules/settings/types/setting.types';

@Injectable({
	providedIn: 'root',
})
export class SettingService {
	public mint_dashboard_short_settings: Record<string, number | null> = {
		date_start: null,
		date_end: null,
	};
	public mint_keysets_short_settings: Record<string, number | null> = {
		date_start: null,
		date_end: null,
	};
	public mint_database_short_settings: Record<string, number | null> = {
		date_start: null,
		date_end: null,
		page: null,
	};

	constructor(
		private dateAdapter: DateAdapter<Date>,
		private localStorageService: LocalStorageService,
	) {}

	public init(): void {
		this.setLocale();
		this.setTimezone();
		this.setTheme();
	}

	/* Locale */
	public getLocale(): string {
		const system_locale = Intl.DateTimeFormat().resolvedOptions().locale;
		return this.localStorageService.getLocale().code ?? system_locale;
	}
	public setLocale(): void {
		const locale = this.getLocale();
		this.dateAdapter.setLocale(locale);
		Settings.defaultLocale = locale;
	}

	/* Timezone */
	public getTimezone(): string {
		const system_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return this.localStorageService.getTimezone().tz ?? system_timezone;
	}
	public setTimezone(): void {
		const timezone = this.getTimezone();
		Settings.defaultZone = timezone;
	}

	/* Theme */
	public getTheme(): ThemeType {
		const prefers_light_theme = window.matchMedia('(prefers-color-scheme: light)').matches;
		const theme = this.localStorageService.getTheme();
		if (theme.type === null) return prefers_light_theme ? ThemeType.LIGHT_MODE : ThemeType.DARK_MODE;
		return theme.type;
	}
	public setTheme(): void {
		const theme = this.getTheme();
		if (theme === null) return document.body.classList.remove(ThemeType.LIGHT_MODE, ThemeType.DARK_MODE);
		document.body.classList.remove(ThemeType.LIGHT_MODE, ThemeType.DARK_MODE);
		document.body.classList.add(theme);
	}

	/* AI Model */
	public getModel(): string | null {
		return this.localStorageService.getModel().model;
	}
	public setModel(model: string | null): void {
		this.localStorageService.setModel({model: model});
	}

	/* Page: Mint Dashboard */
	public getMintDashboardSettings(): AllMintDashboardSettings {
		const long_term_settings = this.localStorageService.getMintDashboardSettings();
		return {
			...long_term_settings,
			...this.mint_dashboard_short_settings,
		} as AllMintDashboardSettings;
	}
	public setMintDashboardShortSettings(settings: {date_start: number; date_end: number}): void {
		this.mint_dashboard_short_settings = settings;
	}
	public setMintDashboardSettings(settings: AllMintDashboardSettings): void {
		this.localStorageService.setMintDashboardSettings(settings);
	}

	/* Page: Mint Keysets */
	public getMintKeysetsSettings(): AllMintKeysetsSettings {
		const long_term_settings = this.localStorageService.getMintKeysetsSettings();
		return {
			...long_term_settings,
			...this.mint_keysets_short_settings,
		} as AllMintKeysetsSettings;
	}
	public setMintKeysetsShortSettings(settings: {date_start: number; date_end: number}): void {
		this.mint_keysets_short_settings = settings;
	}
	public setMintKeysetsSettings(settings: AllMintKeysetsSettings): void {
		this.localStorageService.setMintKeysetsSettings(settings);
	}

	/* Page: Mint Database */
	public getMintDatabaseSettings(): AllMintDatabaseSettings {
		const long_term_settings = this.localStorageService.getMintDatabaseSettings();
		return {
			...long_term_settings,
			...this.mint_database_short_settings,
		} as AllMintDatabaseSettings;
	}
	public setMintDatabaseShortSettings(settings: {date_start: number; date_end: number; page: number}): void {
		this.mint_database_short_settings = settings;
	}
	public setMintDatabaseSettings(settings: AllMintDatabaseSettings): void {
		this.localStorageService.setMintDatabaseSettings(settings);
	}
}
