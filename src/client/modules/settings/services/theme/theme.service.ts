import { Injectable } from '@angular/core';

@Injectable({
  	providedIn: 'root'
})
export class ThemeService {

	constructor() { }

	public getThemeColor(color: string, theme?: 'light' | 'dark'): string {
		const computed_style = getComputedStyle(document.documentElement);
		const value = computed_style.getPropertyValue(color).trim();
		console.log('value', value);
		console.log('theme', theme);
		if( theme ) return this.extractThemeColor(value, theme);
		return value;
	}

	/**
	 * Extracts the hex code from a light-dark CSS variable value
	 * @param value The CSS variable value in format "light-dark(#hex1, #hex2)"
	 * @param theme 'light' or 'dark' to specify which value to extract
	 * @returns The extracted hex code
	 */
	public extractThemeColor(value: string, theme: 'light' | 'dark'): string {
		if (!value.startsWith('light-dark(') || !value.endsWith(')')) return value;
		const content = value.substring(11, value.length - 1);
		const [light_value, dark_value] = content.split(',').map(val => val.trim());
		return theme === 'light' ? light_value : dark_value;
	}
	
}
