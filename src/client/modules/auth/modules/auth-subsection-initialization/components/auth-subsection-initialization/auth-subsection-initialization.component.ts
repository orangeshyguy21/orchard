/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
/* Application Dependencies */
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
import {ThemeType} from '@client/modules/cache/services/local-storage/local-storage.types';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {passwordMatch} from '@client/modules/form/validators/password-match';
/* Native Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';
import {InitializeControl} from '@client/modules/auth/modules/auth-subsection-initialization/types/initialize-control.type';

@Component({
	selector: 'orc-auth-subsection-initialization',
	standalone: false,
	templateUrl: './auth-subsection-initialization.component.html',
	styleUrl: './auth-subsection-initialization.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubsectionInitializationComponent implements OnInit {
	public show_surface: boolean = false;
	public form_init: FormGroup = new FormGroup({
		key: new FormControl(null, [Validators.required]),
		name: new FormControl('admin', [Validators.required, Validators.maxLength(100)]),
		password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
		password_confirm: new FormControl(null, [Validators.required, passwordMatch('password')]),
	});
	public errors: Record<InitializeControl, string | null> = {
		key: null,
		password: null,
		password_confirm: null,
		name: null,
	};

	constructor(
		private readonly authService: AuthService,
		private readonly settingService: SettingService,
		private readonly router: Router,
	) {
		this.form_init.statusChanges.subscribe(() => {
			this.validateForm();
		});
	}

	ngOnInit(): void {
		const theme = this.settingService.getTheme();
		this.show_surface = theme === ThemeType.LIGHT_MODE;
	}

	private validateForm(): void {
		if (!this.form_init.invalid) return;
		Object.keys(this.errors).forEach((control_name) => {
			this.validateFormControl(control_name as InitializeControl);
		});
	}

	private validateFormControl(control_name: InitializeControl): void {
		const control = this.form_init.get(control_name);
		if (!control) return;
		const should_show_error = control?.invalid && (control?.dirty || control?.touched);
		if (should_show_error) this.updateError(control_name, control.errors);
	}

	private updateError(control_name: InitializeControl, error: ValidationErrors | null): void {
		if (error?.['required']) this.errors[control_name] = 'Required';
		if (error?.['password_mismatch']) this.errors[control_name] = 'Password mismatch';
		if (error?.['minlength']) this.errors[control_name] = `Minimum length is ${error['minlength'].requiredLength} characters`;
		if (error?.['maxlength']) this.errors[control_name] = `Maximum length is ${error['maxlength'].requiredLength} characters`;
		if (error?.['setup_key']) this.errors[control_name] = 'Invalid setup key';
		if (error?.['unique_username']) this.errors[control_name] = 'Username already exists';
	}

	public onControlCancel(control_name: string): void {
		if (!control_name) return;
		this.form_init.get(control_name)?.markAsPristine();
		this.form_init.get(control_name)?.markAsUntouched();
		this.form_init.get(control_name)?.setErrors(null);
		this.form_init.get(control_name)?.setValue(null);
	}

	public onBlur(): void {
		this.validateForm();
	}

	public onSubmit(): void {
		this.form_init.markAllAsTouched();
		this.validateForm();
		if (this.form_init.invalid) return;
		this.authService.initialize(this.form_init.value.key, this.form_init.value.name, this.form_init.value.password).subscribe({
			next: () => {
				this.authService.clearInitializationCache();
				this.router.navigate(['/']);
			},
			error: (error) => {
				this.errorControl(error);
			},
		});
	}

	private errorControl(error: string | OrchardErrors): void {
		const has_setup_key_error = (error as OrchardErrors)?.errors?.some((err) => err?.code === 10006);
		if (has_setup_key_error) {
			this.form_init.get('key')?.setErrors({setup_key: true});
		}
		const has_unique_username_error = (error as OrchardErrors)?.errors?.some((err) => err?.code === 10007);
		if (has_unique_username_error) {
			this.form_init.get('name')?.setErrors({unique_username: true});
		}
		this.validateForm();
	}
}
