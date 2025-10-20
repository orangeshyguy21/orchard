/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, ViewChild, ElementRef, signal, computed, effect} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-auth-section-general-formcontrol-password',
	standalone: false,
	templateUrl: './auth-section-general-formcontrol-password.component.html',
	styleUrl: './auth-section-general-formcontrol-password.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSectionGeneralFormcontrolPasswordComponent {
	public form_group = input.required<FormGroup>();
	public control_name = input.required<string>();
	public label = input.required<string>();
	public invalid = input<boolean>(false);
	public dirty = input<boolean>(false);
	public error = input<string | null>(null);
	public focused_control = input.required<boolean>();

	public cancel = output<string>();
	public blur = output<void>();
	public enter = output<void>();

	@ViewChild('element_control') element_control!: ElementRef<HTMLInputElement>;

	public view = signal<boolean>(false);
	public focused = signal<boolean>(false);

	public hot = computed(() => {
		return this.focused() || this.dirty();
	});

	constructor() {
		effect(() => {
			if (this.focused_control() && this.element_control?.nativeElement) {
				this.element_control.nativeElement.focus();
			}
		});
	}

	public toggleView(): void {
		this.view.set(!this.view());
	}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.element_control.nativeElement.blur();
		this.focused.set(false);
		this.cancel.emit(this.control_name());
	}

	public onBlur(event: Event): void {
		event.preventDefault();
		this.blur.emit();
		this.focused.set(false);
	}
}
