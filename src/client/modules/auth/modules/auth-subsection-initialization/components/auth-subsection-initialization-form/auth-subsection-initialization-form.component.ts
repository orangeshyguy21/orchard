/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, Output, EventEmitter} from '@angular/core';
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

	@Output() cancel = new EventEmitter<InitializationControl>();

	constructor() {}

	public onControlCancel(control_name: InitializationControl): void {
		this.cancel.emit(control_name);
	}
}
