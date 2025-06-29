/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Application Dependencies */
import { LightningInfo } from '@client/modules/lightning/classes/lightning-info.class';

@Component({
	selector: 'orc-index-header-lightning',
	standalone: false,
	templateUrl: './index-header-lightning.component.html',
	styleUrl: './index-header-lightning.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class IndexHeaderLightningComponent {

	@Input() loading!: boolean;
	@Input() lightning_info!: LightningInfo;
}
