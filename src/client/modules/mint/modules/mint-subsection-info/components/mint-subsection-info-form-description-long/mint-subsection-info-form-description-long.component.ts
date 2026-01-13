/* Core Dependencies */
import {ChangeDetectionStrategy, Component, ElementRef, input, output, signal, viewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {MintInfoRpc} from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-subsection-info-form-description-long',
	standalone: false,
	templateUrl: './mint-subsection-info-form-description-long.component.html',
	styleUrl: './mint-subsection-info-form-description-long.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionInfoFormDescriptionLongComponent {
	public form_group = input.required<FormGroup>(); // form group containing the long description control
	public control_name = input.required<keyof MintInfoRpc>(); // name of the form control to bind

	public update = output<keyof MintInfoRpc>(); // emitted when form is submitted
	public cancel = output<keyof MintInfoRpc>(); // emitted when form is cancelled

	public element_description_long = viewChild.required<ElementRef<HTMLTextAreaElement>>('element_description_long'); // reference to the textarea element

	public focused_description_long = signal<boolean>(false); // tracks if the long description textarea is focused
	public help_status = signal<boolean>(false); // tracks if the help is visible

	/**
	 * Handles form submission by emitting update event and blurring the textarea
	 * @param {Event} event - the form submit event
	 */
	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit(this.control_name());
		this.element_description_long().nativeElement.blur();
	}

	/**
	 * Handles form cancellation by emitting cancel event and blurring the textarea
	 * @param {Event} event - the cancel event
	 */
	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_name());
		this.element_description_long().nativeElement.blur();
	}
}
