/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, computed} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-settings-subsection-user-user',
	standalone: false,
	templateUrl: './settings-subsection-user-user.component.html',
	styleUrl: './settings-subsection-user-user.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionUserUserComponent {
	public form_group_user_name = input.required<FormGroup>();

	public cancel_user_name = output<string>();
	public submit_user_name = output<void>();
}
