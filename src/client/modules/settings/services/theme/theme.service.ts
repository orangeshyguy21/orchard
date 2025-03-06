import { Injectable } from '@angular/core';

@Injectable({
  	providedIn: 'root'
})
export class ThemeService {

	constructor() { }

	public getOrchardSurface(): string {
		const computed_style = getComputedStyle(document.documentElement);
		return computed_style.getPropertyValue('--mat-sys-surface').trim();
	}

	public getOrchardTertiaryContainer(): string {
		const computed_style = getComputedStyle(document.documentElement);
		return computed_style.getPropertyValue('--mat-sys-tertiary-container').trim();
	}
	
}
