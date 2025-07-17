/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'orc-index-mint-disabled',
	standalone: false,
	templateUrl: './index-mint-disabled.component.html',
	styleUrl: './index-mint-disabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexMintDisabledComponent {
	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();
}
