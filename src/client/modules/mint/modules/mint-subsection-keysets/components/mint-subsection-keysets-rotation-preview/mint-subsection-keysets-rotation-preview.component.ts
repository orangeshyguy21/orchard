/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Native Dependencies */
import {MintUnit} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-keysets-rotation-preview',
	standalone: false,
	templateUrl: './mint-subsection-keysets-rotation-preview.component.html',
	styleUrl: './mint-subsection-keysets-rotation-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionKeysetsRotationPreviewComponent {
	@Input() keyset_in_unit!: MintUnit;
	@Input() keyset_in_index!: number;
	@Input() keyset_in_fee!: number;

	@Input() keyset_out_unit!: MintUnit;
	@Input() keyset_out_index!: number;
	@Input() keyset_out_fee!: number;
	@Input() keyset_out_balance!: number | undefined;
}
