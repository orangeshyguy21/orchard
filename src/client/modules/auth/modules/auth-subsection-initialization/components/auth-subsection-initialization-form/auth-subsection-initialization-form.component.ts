/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal, computed, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
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
	@ViewChild('element_key') element_key!: ElementRef<HTMLInputElement>;
	@ViewChild('element_password') element_password!: ElementRef<HTMLInputElement>;
	@ViewChild('element_password_confirm') element_password_confirm!: ElementRef<HTMLInputElement>;
	@ViewChild('element_name') element_name!: ElementRef<HTMLInputElement>;

	public form_group = input.required<FormGroup>();

	@Output() cancel = new EventEmitter<InitializationControl>();

	public view_key = signal<boolean>(false);
	public view_password = signal<boolean>(false);
	public view_password_confirm = signal<boolean>(false);

	public focused_key = signal<boolean>(false);
	public focused_password = signal<boolean>(false);
	public focused_password_confirm = signal<boolean>(false);
	public focused_name = signal<boolean>(false);

	public hot_key = computed(() => {
		const focused = this.focused_key();
		const dirty = this.form_group()?.get('key')?.dirty;
		console.log('hot_key', focused, dirty);
		if (focused || dirty) return true;
		return false;
	});
	public hot_password = computed(() => {
		const focused = this.focused_password();
		const dirty = this.form_group()?.get('password')?.dirty;
		if (focused || dirty) return true;
		return false;
	});
	public hot_password_confirm = computed(() => {
		const focused = this.focused_password_confirm();
		const dirty = this.form_group()?.get('password_confirm')?.dirty;
		if (focused || dirty) return true;
		return false;
	});
	public hot_name = computed(() => {
		const focused = this.focused_name();
		const dirty = this.form_group()?.get('name')?.dirty;
		if (focused || dirty) return true;
		return false;
	});

	public invalid_key = computed(() => {
		return this.form_group()?.get('key')?.invalid || false;
	});
	public invalid_password = computed(() => {
		return this.form_group()?.get('password')?.invalid || false;
	});
	public invalid_password_confirm = computed(() => {
		return this.form_group()?.get('password_confirm')?.invalid || false;
	});
	public invalid_name = computed(() => {
		return this.form_group()?.get('name')?.invalid || false;
	});

	public error_key = computed(() => {
		return this.form_group()?.get('key')?.hasError;
	});
	public error_password = computed(() => {
		return this.form_group()?.get('password')?.hasError;
	});
	public error_password_confirm = computed(() => {
		return this.form_group()?.get('password_confirm')?.hasError;
	});
	public error_name = computed(() => {
		return this.form_group()?.get('name')?.hasError;
	});

	constructor() {}

	public toggleControlView(control_name: string): void {
		switch (control_name) {
			case 'key':
				this.view_key.set(!this.view_key());
				break;
			case 'password':
				this.view_password.set(!this.view_password());
				break;
			case 'password_confirm':
				this.view_password_confirm.set(!this.view_password_confirm());
				break;
		}
	}

	public onControlCancel(event: Event, control_name: InitializationControl): void {
		event.preventDefault();
		this.cancel.emit(control_name);
		switch (control_name) {
			case 'key':
				this.element_key.nativeElement.blur();
				this.focused_key.set(false);
				break;
			case 'password':
				this.element_password.nativeElement.blur();
				this.focused_password.set(false);
				break;
			case 'password_confirm':
				this.element_password_confirm.nativeElement.blur();
				this.focused_password_confirm.set(false);
				break;
			case 'name':
				this.element_name.nativeElement.blur();
				this.focused_name.set(false);
				break;
		}
	}
}
