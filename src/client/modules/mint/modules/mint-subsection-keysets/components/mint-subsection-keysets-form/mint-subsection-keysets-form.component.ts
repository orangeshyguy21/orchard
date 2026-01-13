/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {MatSelectChange} from '@angular/material/select';
/* Native Dependencies */
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
/* Shared Dependencies */
import {MintUnit} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-keysets-form',
	standalone: false,
	templateUrl: './mint-subsection-keysets-form.component.html',
	styleUrl: './mint-subsection-keysets-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionKeysetsFormComponent {
	@Input() form_group!: FormGroup;
	@Input() unit_options!: {value: string; label: string}[];
	@Input() keyset_out!: MintKeyset;
	@Input() keyset_out_balance!: MintBalance | undefined;
	@Input() median_notes!: number;

	@Output() close = new EventEmitter<void>();
	@Output() updateUnit = new EventEmitter<MintUnit>();

	public help_unit = signal<boolean>(false);
	public help_fee = signal<boolean>(true);
	public help_max_order = signal<boolean>(true);

	public get keyset_in_fee_estimate(): number {
		const fee_ppk = this.form_group.get('input_fee_ppk')?.value;
		const median_notes = this.median_notes;
		if (fee_ppk > 0 && median_notes === 0) return 1;
		return Math.floor((median_notes * fee_ppk + 999) / 1000);
	}

	public onUnitChange(event: MatSelectChange): void {
		this.updateUnit.emit(event.value);
	}
}
