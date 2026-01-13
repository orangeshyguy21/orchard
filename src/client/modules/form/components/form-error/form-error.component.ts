/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Vendor Dependencies */
import {ValidationErrors} from '@angular/forms';

@Component({
	selector: 'orc-form-error',
	standalone: false,
	templateUrl: './form-error.component.html',
	styleUrl: './form-error.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
	public readonly errors = input.required<ValidationErrors | null | undefined>();

	public known_error = computed(() => {
		const errors = this.errors();
		if (!errors) return '';
		if (errors['required']) return 'Required';
		if (errors['maxlength']) return `Must be less than ${errors['maxlength'].requiredLength} characters`;
		if (errors['minlength']) return `Must be at least ${errors['minlength'].requiredLength} characters`;
		if (errors['min']) return `Must be at least ${errors['min']?.min}`;
		if (errors['max']) return `Cannot be greater than ${errors['max']?.max}`;
		if (errors['orchardInteger']) return 'Must be a whole number';
		if (errors['orchardCents']) return 'Must have 2 decimals';
		if (errors['orchardMicros']) return 'Invalid format';
		return '';
	});
}

// { "maxlength": { "requiredLength": 1000, "actualLength": 1104 } }

// public filename_error = computed(() => {
//     if (this.form_group().get('filename')?.hasError('required')) return 'Required';
//     if (this.form_group().get('filename')?.hasError('maxlength'))
//         return `Must be less than ${this.form_group().get('filename')?.getError('maxlength')?.requiredLength} characters`;
//     if (this.form_group().get('filename')?.errors) return 'Invalid';
//     return '';
// });

// public get max_order_error(): string {
//     if (this.form_group.get('max_order')?.hasError('required')) return 'Required';
//     if (this.form_group.get('max_order')?.hasError('min'))
//         return `Must be at least ${this.form_group.get('max_order')?.getError('min')?.min}`;
//     if (this.form_group.get('max_order')?.hasError('max'))
//         return `Must be at most ${this.form_group.get('max_order')?.getError('max')?.max}`;
//     if (this.form_group.get('max_order')?.errors) return 'Invalid';
//     return '';
// }
