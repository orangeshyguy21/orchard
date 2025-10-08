/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-mint-subsection-database-form-backup',
	standalone: false,
	templateUrl: './mint-subsection-database-form-backup.component.html',
	styleUrl: './mint-subsection-database-form-backup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseFormBackupComponent {
	@Input() active!: boolean;
	@Input() form_group!: FormGroup;
	@Input() database_version!: string;
	@Input() database_timestamp!: number;
	@Input() database_implementation!: string;

	@Output() close = new EventEmitter<void>();

	public filename_error = computed(() => {
		if (this.form_group.get('filename')?.hasError('required')) return 'Required';
		if (this.form_group.get('filename')?.hasError('maxlength'))
			return `Must be less than ${this.form_group.get('filename')?.getError('maxlength')?.requiredLength} characters`;
		if (this.form_group.get('filename')?.errors) return 'Invalid';
		return '';
	});
}
