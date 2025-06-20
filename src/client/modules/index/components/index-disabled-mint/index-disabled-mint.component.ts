/* Core Dependencies */
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'orc-index-disabled-mint',
	standalone: false,
	templateUrl: './index-disabled-mint.component.html',
	styleUrl: './index-disabled-mint.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexDisabledMintComponent {

  	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();

}
