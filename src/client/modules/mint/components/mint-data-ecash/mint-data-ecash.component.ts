/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Application Dependencies */
import { MintProofGroup } from '@client/modules/mint/classes/mint-proof-group.class';
import { MintPromiseGroup } from '@client/modules/mint/classes/mint-promise-group.class';

@Component({
	selector: 'orc-mint-data-ecash',
	standalone: false,
	templateUrl: './mint-data-ecash.component.html',
	styleUrl: './mint-data-ecash.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintDataEcashComponent {

	@Input() public group!: MintProofGroup | MintPromiseGroup;

}
