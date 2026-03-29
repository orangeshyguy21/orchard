import {AbstractControl, ValidationErrors} from '@angular/forms';

export function url(control: AbstractControl): ValidationErrors | null {
	const value = control.value;
	if (value === null || value === undefined || value === '') return null;
	try {
		const parsed = new URL(value);
		if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return {orchardUrl: true};
		return null;
	} catch {
		return {orchardUrl: true};
	}
}
