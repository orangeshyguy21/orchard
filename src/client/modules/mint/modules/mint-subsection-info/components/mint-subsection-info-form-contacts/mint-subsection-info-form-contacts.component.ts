/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup, FormArray} from '@angular/forms';
/* Application Dependencies */
import {MintInfoRpc} from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-subsection-info-form-contacts',
	standalone: false,
	templateUrl: './mint-subsection-info-form-contacts.component.html',
	styleUrl: './mint-subsection-info-form-contacts.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionInfoFormContactsComponent {
	public form_group = input.required<FormGroup>(); // form group containing the contacts controls
	public form_array = input.required<FormArray>(); // form array containing contact entries
	public array_name = input.required<keyof MintInfoRpc>(); // name of the form array to bind
	public array_length = input.required<number>(); // current length of the form array
	public device_mobile = input.required<boolean>(); // whether the device is mobile

	public update = output<{array_name: keyof MintInfoRpc; control_index: number}>(); // emitted when a contact is updated
	public cancel = output<{array_name: keyof MintInfoRpc; control_index: number}>(); // emitted when a contact edit is cancelled
	public remove = output<{array_name: keyof MintInfoRpc; control_index: number}>(); // emitted when a contact is removed
	public addControl = output<void>(); // emitted when a new contact is added

	public added_index = signal<number | null>(null); // index of the newly added contact
	public added_method = signal<string | null>(null); // method of the newly added contact
	public help_status = signal<boolean>(false); // tracks if the help is visible

	public onAddControl(): void {
		this.added_index.set(this.form_array().length);
		this.added_method.set(this.getAddedMethod());
		this.addControl.emit();
	}

	public onControlUpdate(index: number): void {
		this.update.emit({
			array_name: this.array_name(),
			control_index: index,
		});
	}

	public onControlCancel(index: number): void {
		this.cancel.emit({
			array_name: this.array_name(),
			control_index: index,
		});
	}

	public onControlRemove(index: number): void {
		this.remove.emit({
			array_name: this.array_name(),
			control_index: index,
		});
	}

	private getAddedMethod(): string {
		const all_methods = ['email', 'twitter', 'nostr'];
		const used_methods = this.form_array().controls.map((control) => control.get('method')?.value);
		const remaining_methods = all_methods.filter((method) => !used_methods.includes(method));
		if (remaining_methods.length > 0) return remaining_methods[0];
		return 'email';
	}
}
