/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
/* Application Dependencies */
import { EventData } from 'src/client/modules/event/classes/event-data.class';

@Component({
	selector: 'orc-primary-nav',
	standalone: false,
	templateUrl: './primary-nav.component.html',
	styleUrl: './primary-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavComponent {

	@Input() active_section!: string;
	@Input() active_event!: EventData | null;
	@Input() enabled_bitcoin!: boolean;
	@Input() enabled_lightning!: boolean;
	@Input() enabled_mint!: boolean;
	@Input() online_bitcoin!: boolean;
	@Input() online_lightning!: boolean;
	@Input() online_mint!: boolean;
	@Input() syncing_bitcoin!: boolean;
	@Input() syncing_lightning!: boolean;
	@Input() syncing_mint!: boolean;
	@Input() block_count!: number;
	@Input() chain!: string;

	@Output() save = new EventEmitter<void>();
	@Output() cancel = new EventEmitter<void>();

	constructor() {}
}
