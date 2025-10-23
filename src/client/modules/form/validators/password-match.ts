import {AbstractControl, ValidationErrors} from '@angular/forms';

export const passwordMatch = (password_field_name: string = 'password') => {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!control.parent) return null;
		const password = control.parent.get(password_field_name);
		if (!password) return null;
		return password.value === control.value ? null : {password_mismatch: true};
	};
};
