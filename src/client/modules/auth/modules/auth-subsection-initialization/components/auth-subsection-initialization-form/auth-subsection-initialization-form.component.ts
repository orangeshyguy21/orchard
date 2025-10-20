/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Native Dependencies */
import {InitializationControl} from '@client/modules/auth/modules/auth-subsection-initialization/types/initialization-control.type';

@Component({
	selector: 'orc-auth-subsection-initialization-form',
	standalone: false,
	templateUrl: './auth-subsection-initialization-form.component.html',
	styleUrl: './auth-subsection-initialization-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubsectionInitializationFormComponent {
	public form_group = input.required<FormGroup>();
	public errors = input.required<Record<InitializationControl, string | null>>();

	public cancel = output<InitializationControl>();
	public submit = output<void>();
	public blur = output<void>();

	public focused_control = signal<InitializationControl | null>(null);

	constructor() {}

	public onControlCancel(control_name: InitializationControl): void {
		this.cancel.emit(control_name);
	}
}
