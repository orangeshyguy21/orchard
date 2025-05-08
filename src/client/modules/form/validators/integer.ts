import { AbstractControl, ValidationErrors } from '@angular/forms';

export function integer(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return Number.isInteger(value) ? null : { orchardInteger: true };
}