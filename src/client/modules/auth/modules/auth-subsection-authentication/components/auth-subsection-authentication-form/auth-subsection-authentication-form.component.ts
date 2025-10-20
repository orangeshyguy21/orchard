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
	// @ViewChild('element_password') element_password!: ElementRef<HTMLInputElement>;

	// @Input() form_group!: FormGroup;
	// @Input() control_name!: string;

	// @Output() update = new EventEmitter<string>();
	// @Output() cancel = new EventEmitter<string>();

	// public password_visible = signal(false);

	// public get form_error(): string {
	// 	if (this.form_group.get(this.control_name)?.hasError('throttler')) return 'Too many attempts';
	// 	if (this.form_group.get(this.control_name)?.hasError('incorrect')) return 'Incorrect password';
	// 	if (this.form_group.get(this.control_name)?.hasError('required')) return 'Required';
	// 	if (this.form_group.get(this.control_name)?.errors) return 'Invalid password';
	// 	return '';
	// }

	// public get form_hot(): boolean {
	// 	if (document.activeElement === this.element_password?.nativeElement) return true;
	// 	return this.form_group.get(this.control_name)?.dirty ? true : false;
	// }

	// constructor() {}

	// public onSubmit(event: Event): void {
	// 	event.preventDefault();
	// 	this.update.emit(this.control_name);
	// }

	// public onCancel(event: Event): void {
	// 	event.preventDefault();
	// 	this.cancel.emit(this.control_name);
	// 	this.element_password.nativeElement.blur();
	// }

	// public togglePasswordVisibility(): void {
	// 	this.password_visible.set(!this.password_visible());
	// }

	public form_group = input.required<FormGroup>();
	public errors = input.required<Record<AuthenticateControl, string | null>>();

	public cancel = output<AuthenticateControl>();
	public submit = output<void>();
	public blur = output<void>();

	public focused_control = signal<AuthenticateControl | null>(null);

	constructor() {}

	public onControlCancel(control_name: AuthenticateControl): void {
		this.cancel.emit(control_name);
	}
}
