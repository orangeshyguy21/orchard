/* Core Dependencies */
import {ChangeDetectionStrategy, Component, signal, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators, ValidationErrors} from '@angular/forms';
/* Vendor Dependencies */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
/* Application Dependencies */
import {passwordMatch} from '@client/modules/form/validators/password-match';

type PasswordControl = 'password_current' | 'password_new' | 'password_new_confirm';

@Component({
	selector: 'orc-settings-subsection-user-user-password-dialog',
	standalone: false,
	templateUrl: './settings-subsection-user-user-password-dialog.component.html',
	styleUrl: './settings-subsection-user-user-password-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionUserUserPasswordDialogComponent {
	public form_password: FormGroup = new FormGroup({
		password_current: new FormControl(null, [Validators.required]),
		password_new: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
		password_new_confirm: new FormControl(null, [Validators.required, passwordMatch('password_new')]),
	});
	public errors: Record<PasswordControl, string | null> = {
		password_current: null,
		password_new: null,
		password_new_confirm: null,
	};

	public focused_control = signal<PasswordControl | null>(null);

	constructor(
		private readonly dialog_ref: MatDialogRef<SettingsSubsectionUserUserPasswordDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: {phone_view: boolean},
	) {}

	public onControlCancel(control_name: string): void {
		if (!control_name) return;
		this.form_password.get(control_name)?.markAsPristine();
		this.form_password.get(control_name)?.markAsUntouched();
		this.form_password.get(control_name)?.setErrors(null);
		this.form_password.get(control_name)?.setValue(null);
	}

	public onBlur(): void {
		this.validateForm();
	}

	private validateForm(): void {
		if (!this.form_password.invalid) return;
		Object.keys(this.errors).forEach((control_name) => {
			this.validateFormControl(control_name as PasswordControl);
		});
	}

	private validateFormControl(control_name: PasswordControl): void {
		const control = this.form_password.get(control_name);
		if (!control) return;
		const should_show_error = control?.invalid && (control?.dirty || control?.touched);
		if (should_show_error) this.updateError(control_name, control.errors);
	}

	private updateError(control_name: PasswordControl, error: ValidationErrors | null): void {
		if (error?.['required']) this.errors[control_name] = 'Required';
		if (error?.['password_mismatch']) this.errors[control_name] = 'Password mismatch';
		if (error?.['minlength']) this.errors[control_name] = `Minimum length is ${error['minlength'].requiredLength} characters`;
		if (error?.['maxlength']) this.errors[control_name] = `Maximum length is ${error['maxlength'].requiredLength} characters`;
		if (error?.['setup_key']) this.errors[control_name] = 'Invalid setup key';
		if (error?.['unique_username']) this.errors[control_name] = 'Username already exists';
	}

	public onSave(): void {
		if (this.form_password.invalid) return;
		this.dialog_ref.close(this.form_password);
	}
}
