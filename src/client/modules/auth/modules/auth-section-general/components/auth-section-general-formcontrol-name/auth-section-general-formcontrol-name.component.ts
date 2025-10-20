/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, Output, EventEmitter, ViewChild, ElementRef, signal, computed} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-auth-section-general-formcontrol-name',
	standalone: false,
	templateUrl: './auth-section-general-formcontrol-name.component.html',
	styleUrl: './auth-section-general-formcontrol-name.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSectionGeneralFormcontrolNameComponent {
	public form_group = input.required<FormGroup>();
	public control_name = input.required<string>();
	public label = input.required<string>();
	public invalid = input<boolean>(false);
	public dirty = input<boolean>(false);
	public error = input<string | null>(null);

	@Output() cancel = new EventEmitter<string>();

	@ViewChild('element_control') element_control!: ElementRef<HTMLInputElement>;

	public focused = signal<boolean>(false);

	public hot = computed(() => {
		return this.focused() || this.dirty();
	});

	public onCancel(event: Event): void {
		event.preventDefault();
		this.element_control.nativeElement.blur();
		this.focused.set(false);
		this.cancel.emit(this.control_name());
	}
}
