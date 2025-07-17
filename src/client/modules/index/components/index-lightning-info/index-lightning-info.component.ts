/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';

@Component({
	selector: 'orc-index-lightning-info',
	standalone: false,
	templateUrl: './index-lightning-info.component.html',
	styleUrl: './index-lightning-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexLightningInfoComponent {
	@Input() lightning_info!: LightningInfo | null;
}
