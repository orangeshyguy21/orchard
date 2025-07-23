/* Core Dependencies */
import {Injectable} from '@angular/core';
/* Local Dependencies */
import {Timezone, Locale, Theme, Model, MintDashboardSettings, MintKeysetsSettings, MintDatabaseSettings} from './local-storage.types';

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	private readonly STORAGE_KEYS = {
		/* Auth Settings */
		AUTH_TOKEN_KEY: 'v0.auth.token',
		REFRESH_TOKEN_KEY: 'v0.auth.refresh_token',
		/* User Settings */
		TIMEZONE_KEY: 'v0.setting.timezone',
		LOCALE_KEY: 'v0.setting.locale',
		THEME_KEY: 'v0.setting.theme',
		MODEL_KEY: 'v0.setting.model',
		/* Mint Settings */
		MINT_DASHBOARD_KEY: 'v0.mint.dashboard.settings',
		MINT_KEYSETS_KEY: 'v0.mint.keysets.settings',
		MINT_DATABASE_KEY: 'v0.mint.database.settings',
	};

	constructor() {}

	/**
	 * Get an item from local storage
	 * @param key The key to retrieve
	 * @returns The stored value or null if not found
	 */
	getItem<T>(key: string): T | null {
		const item = localStorage.getItem(key);
		if (!item) return null;

		try {
			return JSON.parse(item);
		} catch (error) {
			console.error(`Error parsing item with key ${key} from localStorage:`, error);
			return null;
		}
	}

	/**
	 * Store an item in local storage
	 * @param key The key to store the value under
	 * @param value The value to store
	 */
	setItem(key: string, value: any): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error storing item with key ${key} in localStorage:`, error);
		}
	}

	getAuthToken(): string | null {
		return this.getItem<string>(this.STORAGE_KEYS.AUTH_TOKEN_KEY);
	}
	getRefreshToken(): string | null {
		return this.getItem<string>(this.STORAGE_KEYS.REFRESH_TOKEN_KEY);
	}
	getTimezone(): Timezone {
		const timezone = this.getItem<Timezone>(this.STORAGE_KEYS.TIMEZONE_KEY);
		if (!timezone) return {tz: null};
		return timezone;
	}
	getLocale(): Locale {
		const locale = this.getItem<Locale>(this.STORAGE_KEYS.LOCALE_KEY);
		if (!locale) return {code: null};
		return locale;
	}
	getTheme(): Theme {
		const theme = this.getItem<Theme>(this.STORAGE_KEYS.THEME_KEY);
		if (!theme) return {type: null};
		return theme;
	}
	getModel(): Model {
		const model = this.getItem<Model>(this.STORAGE_KEYS.MODEL_KEY);
		if (!model) return {model: null};
		return model;
	}
	getMintDashboardSettings(): MintDashboardSettings {
		const settings = this.getItem<MintDashboardSettings>(this.STORAGE_KEYS.MINT_DASHBOARD_KEY);
		if (!settings) return {date_start: null, units: null, interval: null, type: null};
		return settings;
	}
	getMintKeysetsSettings(): MintKeysetsSettings {
		const settings = this.getItem<MintKeysetsSettings>(this.STORAGE_KEYS.MINT_KEYSETS_KEY);
		if (!settings) return {date_start: null, units: null, status: null};
		return settings;
	}
	getMintDatabaseSettings(): MintDatabaseSettings {
		const settings = this.getItem<MintDatabaseSettings>(this.STORAGE_KEYS.MINT_DATABASE_KEY);
		if (!settings) return {date_start: null, type: null, units: null, states: null};
		return settings;
	}

	setAuthToken(token: string | null): void {
		this.setItem(this.STORAGE_KEYS.AUTH_TOKEN_KEY, token);
	}
	setRefreshToken(token: string | null): void {
		this.setItem(this.STORAGE_KEYS.REFRESH_TOKEN_KEY, token);
	}
	setTimezone(timezone: Timezone): void {
		this.setItem(this.STORAGE_KEYS.TIMEZONE_KEY, timezone);
	}
	setLocale(locale: Locale): void {
		this.setItem(this.STORAGE_KEYS.LOCALE_KEY, locale);
	}
	setTheme(theme: Theme): void {
		this.setItem(this.STORAGE_KEYS.THEME_KEY, theme);
	}
	setModel(model: Model): void {
		this.setItem(this.STORAGE_KEYS.MODEL_KEY, model);
	}
	setMintDashboardSettings(settings: MintDashboardSettings): void {
		this.setItem(this.STORAGE_KEYS.MINT_DASHBOARD_KEY, settings);
	}
	setMintKeysetsSettings(settings: MintKeysetsSettings): void {
		this.setItem(this.STORAGE_KEYS.MINT_KEYSETS_KEY, settings);
	}
	setMintDatabaseSettings(settings: MintDatabaseSettings): void {
		this.setItem(this.STORAGE_KEYS.MINT_DATABASE_KEY, settings);
	}

	/**
	 * Remove an item from local storage
	 * @param key The key to remove
	 */
	removeItem(key: string): void {
		localStorage.removeItem(key);
	}

	/**
	 * Clear all items from local storage
	 */
	clear(): void {
		localStorage.clear();
	}

	/**
	 * Check if a key exists in local storage
	 * @param key The key to check
	 * @returns True if the key exists, false otherwise
	 */
	hasItem(key: string): boolean {
		return localStorage.getItem(key) !== null;
	}
}
