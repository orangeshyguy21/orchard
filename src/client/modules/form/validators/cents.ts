import {AbstractControl, ValidationErrors} from '@angular/forms';

export function cents(control: AbstractControl): ValidationErrors | null {
	const value = control.value;
	if (value === null || value === undefined || value === '') return null;
	const regex = /^\d+\.\d{2}$/;
	return regex.test(value.toString()) ? null : {orchardCents: true};
}
