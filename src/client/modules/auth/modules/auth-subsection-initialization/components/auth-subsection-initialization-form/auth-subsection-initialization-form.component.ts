/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Native Dependencies */
import {InitializeControl} from '@client/modules/auth/modules/auth-subsection-initialization/types/initialize-control.type';

@Component({
	selector: 'orc-auth-subsection-initialization-form',
	standalone: false,
	templateUrl: './auth-subsection-initialization-form.component.html',
	styleUrl: './auth-subsection-initialization-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubsectionInitializationFormComponent {
	public form_group = input.required<FormGroup>();
	public errors = input.required<Record<InitializeControl, string | null>>();
	public device_mobile = input.required<boolean>();

	public cancel = output<InitializeControl>();
	public submit = output<void>();
	public blur = output<void>();

	public focused_control = signal<InitializeControl | null>(null);

	constructor() {}

	public onControlCancel(control_name: InitializeControl): void {
		this.cancel.emit(control_name);
	}
}
