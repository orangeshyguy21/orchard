/* Core Dependencies */
import {ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, input, output, signal, viewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {MintInfoRpc} from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-subsection-info-form-name',
	standalone: false,
	templateUrl: './mint-subsection-info-form-name.component.html',
	styleUrl: './mint-subsection-info-form-name.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionInfoFormNameComponent {
	public form_group = input.required<FormGroup>(); // form group containing the name control
	public control_name = input.required<keyof MintInfoRpc>(); // name of the form control to bind
	public focused = input<boolean>(false); // whether to auto-focus the input on init

	public update = output<keyof MintInfoRpc>(); // emitted when form is submitted
	public cancel = output<keyof MintInfoRpc>(); // emitted when form is cancelled

	public element_name = viewChild.required<ElementRef<HTMLInputElement>>('element_name'); // reference to the input element

	public focused_name = signal<boolean>(false); // tracks if the name input is focused
	public help_status = signal<boolean>(false); // tracks if the help is visible

	public form_hot = computed(() => {
		if (document.activeElement === this.element_name()?.nativeElement) return true;
		return this.form_group().get(this.control_name())?.dirty ? true : false;
	});

	constructor() {
		afterNextRender(() => {
			if (this.focused()) this.element_name().nativeElement.focus();
		});
	}

	/**
	 * Handles form submission by emitting update event and blurring the input
	 * @param {Event} event - the form submit event
	 */
	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit(this.control_name());
		this.element_name().nativeElement.blur();
	}

	/**
	 * Handles form cancellation by emitting cancel event and blurring the input
	 * @param {Event} event - the cancel event
	 */
	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_name());
		this.element_name().nativeElement.blur();
	}
}
