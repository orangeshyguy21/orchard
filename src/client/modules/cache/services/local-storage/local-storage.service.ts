/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Local Dependencies */
import { Timezone, Locale, Theme, MintChartSettings } from './local-storage.types';

@Injectable({
  	providedIn: 'root'
})
export class LocalStorageService {

	private readonly STORAGE_KEYS = {
		/* User Settings */
		TIMEZONE_KEY: 'v0.setting.timezone',
		LOCALE_KEY: 'v0.setting.locale',
		THEME_KEY: 'v0.setting.theme',
		/* Chart Settings */
		CHART_SETTINGS_KEY: 'v0.chart.mint.settings',
	};


    // public selected_units: MintUnit[] = [];
	// public selected_date_start!: number;
	// public selected_date_end!: number;
	// public selected_interval: MintAnalyticsInterval = MintAnalyticsInterval.Day;
	// public selected_type!: ChartType;


  	constructor() { }
	
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

	getTimezone(): Timezone {
		const timezone = this.getItem<Timezone>(this.STORAGE_KEYS.TIMEZONE_KEY);
		if (!timezone) return { tz: null };
		return timezone;
	}
	getLocale(): Locale {
		const locale = this.getItem<Locale>(this.STORAGE_KEYS.LOCALE_KEY);
		if (!locale) return { code: null };
		return locale;
	}
	getTheme(): Theme {
		const theme = this.getItem<Theme>(this.STORAGE_KEYS.THEME_KEY);
		if (!theme) return { type: null };
		return theme;
	}
	getMintChartSettings(): MintChartSettings {
		const settings = this.getItem<MintChartSettings>(this.STORAGE_KEYS.CHART_SETTINGS_KEY);
		if (!settings) return { units: null, interval: null, type: null };
		return settings;
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
	setMintChartSettings(settings: MintChartSettings): void {
		this.setItem(this.STORAGE_KEYS.CHART_SETTINGS_KEY, settings);
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
