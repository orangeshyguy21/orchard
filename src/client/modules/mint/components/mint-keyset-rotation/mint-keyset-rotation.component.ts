/* Core Dependencies */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';

@Component({
	selector: 'orc-mint-keyset-rotation',
	standalone: false,
	templateUrl: './mint-keyset-rotation.component.html',
	styleUrl: './mint-keyset-rotation.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintKeysetRotationComponent {

	@Input() form_group!: FormGroup;
	@Input() unit_options!: { value: string, label: string }[];
	@Input() keyset_out!: MintKeyset;
	@Input() keyset_out_balance!: MintBalance | undefined;
	@Input() median_notes!: number;

	@Output() close = new EventEmitter<void>();

	// public fee_error = computed(() => {
	// 	if (this.form_group.get('input_fee_ppk')?.hasError('required')) return 'Required';
	// 	if (this.form_group.get('input_fee_ppk')?.hasError('min')) return `Must be at least ${this.form_group.get('input_fee_ppk')?.getError("min")?.min}`;
	// 	if (this.form_group.get('input_fee_ppk')?.hasError('max')) return `Must be at most ${this.form_group.get('input_fee_ppk')?.getError("max")?.max}`;
	// 	if (this.form_group.get('input_fee_ppk')?.errors) return 'Invalid';
	// 	return '';
	// });

	// public max_order_error = computed(() => {
	// 	if (this.form_group.get('max_order')?.hasError('required')) return 'Required';
	// 	if (this.form_group.get('max_order')?.hasError('min')) return `Must be at least ${this.form_group.get('max_order')?.getError("min")?.min}`;
	// 	if (this.form_group.get('max_order')?.hasError('max')) return `Must be at most ${this.form_group.get('max_order')?.getError("max")?.max}`;
	// 	if (this.form_group.get('max_order')?.errors) return 'Invalid';
	// 	return '';
	// });

	// public keyset_in_fee_estimate = computed(() => {
	// 	const fee_ppk = this.form_group.get('input_fee_ppk')?.value;
	// 	const median_notes = this.median_notes;
	// 	console.log('MEDIAN NOTES', median_notes);
	// 	return Math.floor((median_notes * fee_ppk + 999) / 1000);
	// });

	public get fee_error(): string {
		if (this.form_group.get('input_fee_ppk')?.hasError('required')) return 'Required';
		if (this.form_group.get('input_fee_ppk')?.hasError('min')) return `Must be at least ${this.form_group.get('input_fee_ppk')?.getError("min")?.min}`;
		if (this.form_group.get('input_fee_ppk')?.hasError('max')) return `Must be at most ${this.form_group.get('input_fee_ppk')?.getError("max")?.max}`;
		if (this.form_group.get('input_fee_ppk')?.errors) return 'Invalid';
		return '';
	}

	public get max_order_error(): string {
		if (this.form_group.get('max_order')?.hasError('required')) return 'Required';
		if (this.form_group.get('max_order')?.hasError('min')) return `Must be at least ${this.form_group.get('max_order')?.getError("min")?.min}`;
		if (this.form_group.get('max_order')?.hasError('max')) return `Must be at most ${this.form_group.get('max_order')?.getError("max")?.max}`;
		if (this.form_group.get('max_order')?.errors) return 'Invalid';
		return '';
	}

	public get keyset_in_fee_estimate(): number {
		const fee_ppk = this.form_group.get('input_fee_ppk')?.value;
		const median_notes = this.median_notes;
		return Math.floor((median_notes * fee_ppk + 999) / 1000);
	}
}