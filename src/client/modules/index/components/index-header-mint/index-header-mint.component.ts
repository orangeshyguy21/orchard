/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
/* Application Dependencies */
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';

@Component({
	selector: 'orc-index-header-mint',
	standalone: false,
	templateUrl: './index-header-mint.component.html',
	styleUrl: './index-header-mint.component.scss',
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
export class IndexHeaderMintComponent {

	@Input() loading!: boolean;
	@Input() info!: MintInfo;
	@Input() error!: boolean;

	public state = computed(() => {
		if( this.error ) return 'offline';
		return 'online';
	});
}
