/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Application Dependencies */
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';

@Component({
	selector: 'orc-index-mint-info',
	standalone: false,
	templateUrl: './index-mint-info.component.html',
	styleUrl: './index-mint-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexMintInfoComponent {
	@Input() loading!: boolean;
	@Input() icon_data!: string | null;
	@Input() info!: MintInfo | null;
}
