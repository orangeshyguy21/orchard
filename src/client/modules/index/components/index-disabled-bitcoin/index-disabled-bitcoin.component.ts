/* Core Dependencies */
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'orc-index-disabled-bitcoin',
	standalone: false,
	templateUrl: './index-disabled-bitcoin.component.html',
	styleUrl: './index-disabled-bitcoin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexDisabledBitcoinComponent {

	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();

}