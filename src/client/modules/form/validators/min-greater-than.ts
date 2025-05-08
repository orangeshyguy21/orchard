import { AbstractControl, ValidationErrors } from '@angular/forms';

export const minGreaterThan = (min_control_name: string) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const min_control = control.parent?.get(min_control_name);
        if (!min_control) return null;
        
        const min_value = min_control.value;
        if (min_value === null || min_value === undefined) return null;
        
        return control.value < min_value 
            ? { min: { min: min_value, actual: control.value } } 
            : null;
    };
};