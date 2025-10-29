/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Native Dependencies */
import {InviteControl} from '@client/modules/auth/modules/auth-subsection-invite/types/invite-control.type';

@Component({
	selector: 'orc-auth-subsection-invite-form',
	standalone: false,
	templateUrl: './auth-subsection-invite-form.component.html',
	styleUrl: './auth-subsection-invite-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubsectionInviteFormComponent {
	public form_group = input.required<FormGroup>();
	public errors = input.required<Record<InviteControl, string | null>>();

	public cancel = output<InviteControl>();
	public submit = output<void>();
	public blur = output<void>();

	public focused_control = signal<InviteControl | null>(null);

	constructor() {}

	public onControlCancel(control_name: InviteControl): void {
		this.cancel.emit(control_name);
	}
}
