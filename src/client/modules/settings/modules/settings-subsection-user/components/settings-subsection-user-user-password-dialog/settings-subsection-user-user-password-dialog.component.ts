/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Application Dependencies */
import {passwordMatch} from '@client/modules/form/validators/password-match';

@Component({
	selector: 'orc-settings-subsection-user-user-password-dialog',
	standalone: false,
	templateUrl: './settings-subsection-user-user-password-dialog.component.html',
	styleUrl: './settings-subsection-user-user-password-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionUserUserPasswordDialogComponent {
	public form_init: FormGroup = new FormGroup({
		password_current: new FormControl(null, [Validators.required]),
		password_new: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
		password_new_confirm: new FormControl(null, [Validators.required, passwordMatch('password_new')]),
	});

	constructor() {}
}
