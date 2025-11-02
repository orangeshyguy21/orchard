/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Native Dependencies */
import {SignupControl} from '@client/modules/auth/modules/auth-subsection-signup/types/signup-control.type';

@Component({
	selector: 'orc-auth-subsection-signup-form',
	standalone: false,
	templateUrl: './auth-subsection-signup-form.component.html',
	styleUrl: './auth-subsection-signup-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubsectionSignupFormComponent {
	public form_group = input.required<FormGroup>();
	public errors = input.required<Record<SignupControl, string | null>>();

	public cancel = output<SignupControl>();
	public submit = output<void>();
	public blur = output<void>();

	public focused_control = signal<SignupControl | null>(null);

	constructor() {}

	public onControlCancel(control_name: SignupControl): void {
		this.cancel.emit(control_name);
	}
}
