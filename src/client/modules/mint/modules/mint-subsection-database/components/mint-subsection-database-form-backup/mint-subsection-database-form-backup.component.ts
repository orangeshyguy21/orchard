/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, computed} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-mint-subsection-database-form-backup',
	standalone: false,
	templateUrl: './mint-subsection-database-form-backup.component.html',
	styleUrl: './mint-subsection-database-form-backup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseFormBackupComponent {
	public readonly active = input.required<boolean>();
	public readonly form_group = input.required<FormGroup>();
	public readonly database_version = input.required<string>();
	public readonly database_timestamp = input.required<number>();
	public readonly database_implementation = input.required<string>();

	public readonly close = output<void>();

	public filename_error = computed(() => {
		if (this.form_group().get('filename')?.hasError('required')) return 'Required';
		if (this.form_group().get('filename')?.hasError('maxlength'))
			return `Must be less than ${this.form_group().get('filename')?.getError('maxlength')?.requiredLength} characters`;
		if (this.form_group().get('filename')?.errors) return 'Invalid';
		return '';
	});
}
