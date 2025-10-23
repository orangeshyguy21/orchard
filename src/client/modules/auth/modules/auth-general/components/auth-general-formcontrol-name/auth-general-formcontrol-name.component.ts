/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, ViewChild, ElementRef, signal, computed, effect} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-auth-general-formcontrol-name',
	standalone: false,
	templateUrl: './auth-general-formcontrol-name.component.html',
	styleUrl: './auth-general-formcontrol-name.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthGeneralFormcontrolNameComponent {
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

	public onCancel(event: Event): void {
		event.preventDefault();
		this.element_control.nativeElement.blur();
		this.focused.set(false);
		this.cancel.emit(this.control_name());
	}

	public onBlur(): void {
		this.blur.emit();
		this.focused.set(false);
	}
}
