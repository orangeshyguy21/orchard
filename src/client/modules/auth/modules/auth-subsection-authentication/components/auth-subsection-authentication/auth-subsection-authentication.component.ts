/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {CrewService} from '@client/modules/crew/services/crew/crew.service';
import {ThemeType} from '@client/modules/cache/services/local-storage/local-storage.types';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
/* Native Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';
import {AuthenticateControl} from '@client/modules/auth/modules/auth-subsection-authentication/types/authenticate-control.type';

@Component({
	selector: 'orc-auth-subsection-authentication',
	standalone: false,
	templateUrl: './auth-subsection-authentication.component.html',
	styleUrl: './auth-subsection-authentication.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubsectionAuthenticationComponent implements OnInit {
	public show_surface: boolean = false;

	public form_auth: FormGroup = new FormGroup({
		name: new FormControl(null, [Validators.required]),
		password: new FormControl(null, [Validators.required]),
	});
	public errors: Record<AuthenticateControl, string | null> = {
		name: null,
		password: null,
	};

	constructor(
		private readonly authService: AuthService,
		private readonly settingDeviceService: SettingDeviceService,
		private readonly crewService: CrewService,
		private readonly router: Router,
	) {
		this.form_auth.valueChanges.subscribe(() => {
			this.clearErrors();
			this.validateForm();
		});
	}

	public ngOnInit(): void {
		const theme = this.settingDeviceService.getTheme();
		this.show_surface = theme === ThemeType.LIGHT_MODE;
	}

	public onControlCancel(control_name: string): void {
		if (!control_name) return;
		this.form_auth.get(control_name)?.markAsPristine();
		this.form_auth.get(control_name)?.markAsUntouched();
		this.form_auth.get(control_name)?.setErrors(null);
		this.form_auth.get(control_name)?.setValue(null);
	}

	public onBlur(): void {
		this.validateForm();
	}

	public onSubmit(): void {
		this.form_auth.markAllAsTouched();
		this.validateForm();
		if (this.form_auth.invalid) return;
		this.crewService.clearUserCache();
		this.authService.authenticate(this.form_auth.value.name, this.form_auth.value.password).subscribe({
			next: () => {
				this.openInterior();
			},
			error: (error) => {
				this.errorControl(error);
			},
		});
	}

	private validateForm(): void {
		if (!this.form_auth.invalid) return;
		Object.keys(this.errors).forEach((control_name) => {
			this.validateFormControl(control_name as AuthenticateControl);
		});
	}

	private validateFormControl(control_name: AuthenticateControl): void {
		const control = this.form_auth.get(control_name);
		if (!control) return;
		const should_show_error = control?.invalid && (control?.dirty || control?.touched);
		if (should_show_error) this.updateError(control_name, control.errors);
	}

	private updateError(control_name: AuthenticateControl, error: ValidationErrors | null): void {
		if (error?.['required']) this.errors[control_name] = 'Required';
		if (error?.['throttler']) this.errors[control_name] = 'Too many attempts, please try again later';
		if (error?.['incorrect']) this.errors[control_name] = 'Incorrect username or password';
	}

	private clearErrors(): void {
		const password_control = this.form_auth.get('password');
		password_control?.setErrors(null, {emitEvent: false});
		this.errors.password = null;
	}

	private errorControl(error: string | OrchardErrors): void {
		let error_validation: Record<string, boolean> = {};
		const has_throttler_error = (error as OrchardErrors)?.errors?.some((err) => err?.code === 10005);
		if (has_throttler_error) error_validation = {throttler: true};
		if (!has_throttler_error) error_validation = {incorrect: true};
		this.form_auth.get('password')?.setErrors(error_validation, {emitEvent: false});
		this.validateForm();
	}

	private openInterior(): void {
		const interior_destination = history.state?.interior_destination;
		this.router.navigate([interior_destination || '/']);
	}
}
