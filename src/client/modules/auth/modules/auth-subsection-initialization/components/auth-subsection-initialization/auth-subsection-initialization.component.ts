/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
/* Application Dependencies */
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
import {ThemeType} from '@client/modules/cache/services/local-storage/local-storage.types';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
/* Native Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';

@Component({
	selector: 'orc-auth-subsection-initialization',
	standalone: false,
	templateUrl: './auth-subsection-initialization.component.html',
	styleUrl: './auth-subsection-initialization.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubsectionInitializationComponent {
	public show_surface: boolean = false;

	public form_init: FormGroup = new FormGroup({
		key: new FormControl(null, [Validators.required]),
		password: new FormControl(null, [Validators.required]),
		password_confirm: new FormControl(null, [Validators.required]),
		name: new FormControl(null, [Validators.required]),
	});

	constructor(
		private readonly authService: AuthService,
		private readonly settingService: SettingService,
		private readonly router: Router,
	) {}

	public ngOnInit(): void {
		const theme = this.settingService.getTheme();
		this.show_surface = theme === ThemeType.LIGHT_MODE;
	}

	public onControlCancel(control_name: string): void {
		console.log('onControlCancel', control_name);
		if (!control_name) return;
		this.form_init.get(control_name)?.markAsPristine();
		this.form_init.get(control_name)?.markAsUntouched();
		this.form_init.get(control_name)?.setErrors(null);
		this.form_init.get(control_name)?.setValue(null);
	}
}
