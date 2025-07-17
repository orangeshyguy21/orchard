/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Native Dependencies */
import { MintUnit } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-keyset-rotation-preview',
	standalone: false,
	templateUrl: './mint-keyset-rotation-preview.component.html',
	styleUrl: './mint-keyset-rotation-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
		trigger('fadeIn', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('150ms ease-in', style({ opacity: 1 })),
			]),
		]),
	],
})
export class MintKeysetRotationPreviewComponent {

	@Input() keyset_in_unit!: MintUnit;
	@Input() keyset_in_index!: number;
	@Input() keyset_in_fee!: number;

	@Input() keyset_out_unit!: MintUnit;
	@Input() keyset_out_index!: number;
	@Input() keyset_out_fee!: number;
	@Input() keyset_out_balance!: number | undefined;


}
