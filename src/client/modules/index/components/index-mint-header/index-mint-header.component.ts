/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, computed} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
/* Application Dependencies */
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';

@Component({
	selector: 'orc-index-mint-header',
	standalone: false,
	templateUrl: './index-mint-header.component.html',
	styleUrl: './index-mint-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class IndexMintHeaderComponent {
	@Input() enabled!: boolean;
	@Input() loading!: boolean;
	@Input() info!: MintInfo;
	@Input() error!: boolean;

	public state = computed(() => {
		if (this.error) return 'offline';
		return 'online';
	});
}
