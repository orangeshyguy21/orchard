/* Core Dependencies */
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'orc-index-disabled-lightning',
	standalone: false,
	templateUrl: './index-disabled-lightning.component.html',
	styleUrl: './index-disabled-lightning.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexDisabledLightningComponent {

	@Output() navigate: EventEmitter<void> = new EventEmitter<void>();

}