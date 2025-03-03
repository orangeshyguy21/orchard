/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Local Dependencies */
import { Timezone } from './local-storage.types';

@Injectable({
  	providedIn: 'root'
})
export class LocalStorageService {

	private readonly STORAGE_KEYS = {
		TIMEZONE_KEY: 'v0.timezone',
	};

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

	setTimezone(timezone: Timezone): void {
		this.setItem(this.STORAGE_KEYS.TIMEZONE_KEY, timezone);
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
