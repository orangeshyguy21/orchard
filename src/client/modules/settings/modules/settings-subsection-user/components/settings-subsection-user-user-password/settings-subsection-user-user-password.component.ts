/* Core Dependencies */
import {ChangeDetectionStrategy, Component, output} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
/* Native Dependencies */
import {SettingsSubsectionUserUserPasswordDialogComponent} from '@client/modules/settings/modules/settings-subsection-user/components/settings-subsection-user-user-password-dialog/settings-subsection-user-user-password-dialog.component';

@Component({
	selector: 'orc-settings-subsection-user-user-password',
	standalone: false,
	templateUrl: './settings-subsection-user-user-password.component.html',
	styleUrl: './settings-subsection-user-user-password.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionUserUserPasswordComponent {
	public save = output<void>();

	constructor(private readonly dialog: MatDialog) {}

	public onChangePassword(): void {
		const dialog_ref = this.dialog.open(SettingsSubsectionUserUserPasswordDialogComponent);
		dialog_ref.afterClosed().subscribe((form_password: FormGroup) => {
			if (form_password) {
				// Handle the save result here
				console.log('Password saved:', form_password);
			}
		});
	}
}
