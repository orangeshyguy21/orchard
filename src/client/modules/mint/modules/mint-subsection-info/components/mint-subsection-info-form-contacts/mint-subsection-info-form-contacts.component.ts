/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';
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
	@Input() form_group!: FormGroup;
	@Input() form_array!: FormArray;
	@Input() array_name!: keyof MintInfoRpc;
	@Input() array_length!: number;

	@Output() update = new EventEmitter<{array_name: keyof MintInfoRpc; control_index: number}>();
	@Output() cancel = new EventEmitter<{array_name: keyof MintInfoRpc; control_index: number}>();
	@Output() remove = new EventEmitter<{array_name: keyof MintInfoRpc; control_index: number}>();
	@Output() addControl = new EventEmitter<void>();

	public added_index!: number;
	public added_method!: string;

	constructor() {}

	public onAddControl(): void {
		this.added_index = this.form_array.length;
		this.added_method = this.getAddedMethod();
		this.addControl.emit();
	}

	public onControlUpdate(index: number): void {
		this.update.emit({
			array_name: this.array_name,
			control_index: index,
		});
	}

	public onControlCancel(index: number): void {
		this.cancel.emit({
			array_name: this.array_name,
			control_index: index,
		});
	}

	public onControlRemove(index: number): void {
		this.remove.emit({
			array_name: this.array_name,
			control_index: index,
		});
	}

	private getAddedMethod(): string {
		const all_methods = ['email', 'twitter', 'nostr'];
		const used_methods = this.form_array.controls.map((control) => control.get('method')?.value);
		const remaining_methods = all_methods.filter((method) => !used_methods.includes(method));
		if (remaining_methods.length > 0) return remaining_methods[0];
		return 'email';
	}
}
