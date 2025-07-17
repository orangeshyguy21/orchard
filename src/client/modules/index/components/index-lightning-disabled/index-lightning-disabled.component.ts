/* Core Dependencies */
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'orc-index-lightning-disabled',
	standalone: false,
	templateUrl: './index-lightning-disabled.component.html',
	styleUrl: './index-lightning-disabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexLightningDisabledComponent {

	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();

}