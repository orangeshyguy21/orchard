/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';

@Component({
	selector: 'orc-mint-keyset-rotation',
	standalone: false,
	templateUrl: './mint-keyset-rotation.component.html',
	styleUrl: './mint-keyset-rotation.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintKeysetRotationComponent {

	@Input() form_group!: FormGroup;
	@Input() unit_options!: { value: string, label: string }[];
	@Input() keyset_out!: MintKeyset;
	@Input() keyset_out_balance!: MintBalance;

	public onSubmit(event: Event): void {
		console.log(event);
	}
}