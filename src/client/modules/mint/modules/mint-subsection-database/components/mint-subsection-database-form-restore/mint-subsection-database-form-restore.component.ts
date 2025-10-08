/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-mint-subsection-database-form-restore',
	standalone: false,
	templateUrl: './mint-subsection-database-form-restore.component.html',
	styleUrl: './mint-subsection-database-form-restore.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseFormRestoreComponent {
	@Input() active!: boolean;
	@Input() form_group!: FormGroup;

	@Output() close = new EventEmitter<void>();

	public file_loading = signal<number | null>(null);

	public file_error = computed(() => {
		if (this.form_group.get('file')?.hasError('required')) return 'Required';
		if (this.form_group.get('file')?.errors) return 'Invalid';
		return '';
	});

	public get file_quorum(): boolean {
		if (this.file_loading() !== null && this.file_loading() !== 100) return false;
		if (this.form_group.get('file')?.value === null) return false;
		return true;
	}

	constructor() {}

	public onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		this.form_group.patchValue({
			file: input.files[0],
		});
		this.form_group.get('file')?.markAsTouched();
		this.form_group.get('file')?.markAsDirty();
		this.readFileContent();
	}

	private readFileContent(): void {
		if (!this.form_group.get('file')?.value) return;
		this.file_loading.set(0);
		const reader = new FileReader();
		reader.onprogress = (event) => {
			if (event.lengthComputable) {
				const percentage = (event.loaded / event.total) * 100;
				this.file_loading.set(percentage);
			}
		};
		reader.onload = (event) => {
			this.file_loading.set(100);
			const file_content = reader.result as string;
			const base64_content = file_content.split(',')[1];
			this.form_group.patchValue({
				filebase64: base64_content,
			});
			this.form_group.get('filebase64')?.markAsTouched();
		};
		reader.onerror = () => {
			this.file_loading.set(null);
		};
		reader.readAsDataURL(this.form_group.get('file')?.value);
	}
}
