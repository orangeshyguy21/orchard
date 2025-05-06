/* Core Dependencies */
import { AbstractControl } from "@angular/forms";

// Allow numbers like 1, 1.1, 1.12, 1.123 but not 1.1234
export function validateMicros(control: AbstractControl) {
    const value = control.value;
    const regex = /^(?:\d+)(?:\.\d{1,3})?$/;
    if (value === null || value === undefined || value === '') return null;
    return regex.test(value) ? null : { invalid_micros_format: true };
}