/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
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
	constructor(private readonly dialog: MatDialog) {}

	public onChangePassword(): void {
		this.dialog.open(SettingsSubsectionUserUserPasswordDialogComponent, {
			width: '400px',
		});
	}
}
