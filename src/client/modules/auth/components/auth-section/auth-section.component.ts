/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
/* Application Dependencies */
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { ThemeType } from '@client/modules/cache/services/local-storage/local-storage.types';
/* Native Dependencies */
import { AuthService } from '@client/modules/auth/services/auth/auth.service';

@Component({
	selector: 'orc-auth-section',
	standalone: false,
	templateUrl: './auth-section.component.html',
	styleUrl: './auth-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSectionComponent implements OnInit {

	public show_surface:boolean = false;

	public form_auth: FormGroup = new FormGroup({
		password: new FormControl(null, [Validators.required]),
	});

	constructor(
		private readonly authService: AuthService,
		private readonly settingService: SettingService,
		private readonly router: Router,
	) {}

	public ngOnInit(): void {
		this.authService.logout();
		const theme = this.settingService.getTheme();
		this.show_surface = theme === ThemeType.LIGHT_MODE;
	}

	public onControlUpdate(control_name: string): void {
		if( this.form_auth.get(control_name)?.invalid ) return;
		this.form_auth.get(control_name)?.markAsTouched();
		const control_value = this.form_auth.get(control_name)?.value;
		this.authenticate(control_value);
	}

	public onControlCancel(control_name: string): void {
		if(!control_name) return;
		this.form_auth.get(control_name)?.markAsPristine();
		this.form_auth.get(control_name)?.markAsUntouched();
		this.form_auth.get(control_name)?.setErrors(null);
		this.form_auth.get(control_name)?.setValue(null);
	}

	private authenticate(password: string): void {
		this.authService.authenticate(password)
			.subscribe({
				next: (response) => {
					this.openInterior();
				},
				error: (error) => {
					this.errorControl(error.message);
				}
			});
	}

	private errorControl(error: string): void {
		this.form_auth.get('password')?.setErrors({ 'incorrect': true });
	}

	private openInterior(): void {
		const interior_destination = history.state?.interior_destination;
		this.router.navigate([interior_destination || '/']);
	}
}