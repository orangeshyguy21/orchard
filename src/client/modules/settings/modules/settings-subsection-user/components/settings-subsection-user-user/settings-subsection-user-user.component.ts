/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {User} from '@client/modules/user/classes/user.class';

@Component({
	selector: 'orc-settings-subsection-user-user',
	standalone: false,
	templateUrl: './settings-subsection-user-user.component.html',
	styleUrl: './settings-subsection-user-user.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionUserUserComponent {
	public user = input.required<User | null>();
	public form_group_user_name = input.required<FormGroup>();

	public cancel_user_name = output<string>();
	public submit_user_name = output<void>();
	public save_user_password = output<FormGroup>();
}
