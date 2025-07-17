/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'orc-index-bitcoin-disabled',
	standalone: false,
	templateUrl: './index-bitcoin-disabled.component.html',
	styleUrl: './index-bitcoin-disabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexBitcoinDisabledComponent {
	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();
}
