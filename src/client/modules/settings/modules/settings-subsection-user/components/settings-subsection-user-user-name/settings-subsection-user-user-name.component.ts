/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input, output, signal, ViewChild, ElementRef} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-settings-subsection-user-user-name',
	standalone: false,
	templateUrl: './settings-subsection-user-user-name.component.html',
	styleUrl: './settings-subsection-user-user-name.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionUserUserNameComponent {
	@ViewChild('element_control') element_control!: ElementRef<HTMLInputElement>;

	public form_group = input.required<FormGroup>();
	public control_name = input.required<string>();
	public invalid = input<boolean>(false);
	public dirty = input<boolean>(false);

	public cancel = output<string>();
	public submit = output<void>();

	public focused = signal<boolean>(false);
	public help_status = signal<boolean>(false);

	public hot = computed(() => {
		return this.focused() || this.dirty();
	});
	public control = computed(() => {
		return this.form_group().get(this.control_name());
	});

	constructor() {}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_name());
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.element_control.nativeElement.blur();
		this.submit.emit();
	}
}
