/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
/* Native Module Dependencies */
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';

@Component({
	selector: 'orc-mint-connections',
	standalone: false,
	templateUrl: './mint-connections.component.html',
	styleUrl: './mint-connections.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConnectionsComponent {

	@Input() info: MintInfo | null = null;

	public loading: boolean = true;

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['info']) {
			if( !this.info ) return;
			this.init();
		}
	}

	private init(): void {
		console.log(this.info);
		this.loading = false;
	}

}
