/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormControl, Validators, ValidationErrors} from '@angular/forms';
/* Application Dependencies */
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
import {ThemeType} from '@client/modules/cache/services/local-storage/local-storage.types';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {passwordMatch} from '@client/modules/form/validators/password-match';
/* Native Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';
import {InviteControl} from '@client/modules/auth/modules/auth-subsection-invite/types/invite-control.type';

@Component({
	selector: 'orc-auth-subsection-invite',
	standalone: false,
	templateUrl: './auth-subsection-invite.component.html',
	styleUrl: './auth-subsection-invite.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubsectionInviteComponent implements OnInit {
	public show_surface: boolean = false;

	public form_invite: FormGroup = new FormGroup({
		key: new FormControl(null, [Validators.required]),
		name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
		password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
		password_confirm: new FormControl(null, [Validators.required, passwordMatch('password')]),
	});
	public errors: Record<InviteControl, string | null> = {
		key: null,
		name: null,
		password: null,
		password_confirm: null,
	};

	constructor(
		private readonly authService: AuthService,
		private readonly settingService: SettingService,
		private readonly router: Router,
		private route: ActivatedRoute,
	) {
		this.route.params.subscribe((params) => {
			const key = params['key'];
			if (key) this.form_invite.get('key')?.setValue(key);
		});
		this.form_invite.valueChanges.subscribe(() => {
			this.validateForm();
		});
	}

	public ngOnInit(): void {
		const theme = this.settingService.getTheme();
		this.show_surface = theme === ThemeType.LIGHT_MODE;
	}

	private validateForm(): void {
		if (!this.form_invite.invalid) return;
		Object.keys(this.errors).forEach((control_name) => {
			this.validateFormControl(control_name as InviteControl);
		});
	}

	private validateFormControl(control_name: InviteControl): void {
		const control = this.form_invite.get(control_name);
		if (!control) return;
		const should_show_error = control?.invalid && (control?.dirty || control?.touched);
		if (should_show_error) this.updateError(control_name, control.errors);
	}

	private updateError(control_name: InviteControl, error: ValidationErrors | null): void {
		if (error?.['required']) this.errors[control_name] = 'Required';
		if (error?.['password_mismatch']) this.errors[control_name] = 'Password mismatch';
		if (error?.['minlength']) this.errors[control_name] = `Minimum length is ${error['minlength'].requiredLength} characters`;
		if (error?.['maxlength']) this.errors[control_name] = `Maximum length is ${error['maxlength'].requiredLength} characters`;
		if (error?.['invite_key']) this.errors[control_name] = 'Invalid invite key';
		if (error?.['unique_username']) this.errors[control_name] = 'Username already exists';
	}

	public onControlCancel(control_name: string): void {
		if (!control_name) return;
		this.form_invite.get(control_name)?.markAsPristine();
		this.form_invite.get(control_name)?.markAsUntouched();
		this.form_invite.get(control_name)?.setErrors(null);
		this.form_invite.get(control_name)?.setValue(null);
	}

	public onBlur(): void {
		this.validateForm();
	}

	public onSubmit(): void {
		this.form_invite.markAllAsTouched();
		this.validateForm();
		if (this.form_invite.invalid) return;
		this.authService.signup(this.form_invite.value.key, this.form_invite.value.name, this.form_invite.value.password).subscribe({
			next: () => {
				this.router.navigate(['/']);
			},
			error: (error) => {
				this.errorControl(error);
			},
		});
	}

	private errorControl(error: string | OrchardErrors): void {
		const has_invite_key_error = (error as OrchardErrors)?.errors?.some((err) => err?.code === 80003);
		if (has_invite_key_error) {
			this.form_invite.get('key')?.setErrors({invite_key: true});
		}
		const has_unique_username_error = (error as OrchardErrors)?.errors?.some((err) => err?.code === 10007);
		if (has_unique_username_error) {
			this.form_invite.get('name')?.setErrors({unique_username: true});
		}
		this.validateForm();
	}
}

// DPjqsdYwtmBQ
