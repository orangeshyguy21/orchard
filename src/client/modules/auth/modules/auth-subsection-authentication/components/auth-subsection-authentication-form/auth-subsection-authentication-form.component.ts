/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Native Dependencies */
import {AuthenticateControl} from '@client/modules/auth/modules/auth-subsection-authentication/types/authenticate-control.type';

@Component({
	selector: 'orc-auth-subsection-authentication-form',
	standalone: false,
	templateUrl: './auth-subsection-authentication-form.component.html',
	styleUrl: './auth-subsection-authentication-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubsectionAuthenticationFormComponent {
	public form_group = input.required<FormGroup>();
	public errors = input.required<Record<AuthenticateControl, string | null>>();
	public device_mobile = input.required<boolean>();

	public cancel = output<AuthenticateControl>();
	public submit = output<void>();
	public blur = output<void>();

	public focused_control = signal<AuthenticateControl | null>(null);

	constructor() {}

	public onControlCancel(control_name: AuthenticateControl): void {
		this.cancel.emit(control_name);
	}
}
