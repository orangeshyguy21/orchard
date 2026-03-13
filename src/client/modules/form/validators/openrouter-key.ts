import {AbstractControl, ValidationErrors} from '@angular/forms';

const OPENROUTER_KEY_PATTERN = /^sk-or-v1-[a-f0-9]{64}$/;

export function openrouterKey(control: AbstractControl): ValidationErrors | null {
	const value = control.value;
	if (value === null || value === undefined || value === '') return null;
	return OPENROUTER_KEY_PATTERN.test(value) ? null : {orchardOpenrouterKey: true};
}
