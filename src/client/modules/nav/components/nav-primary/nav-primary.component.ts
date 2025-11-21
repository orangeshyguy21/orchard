/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter, input} from '@angular/core';
/* Application Dependencies */
import {EventData} from 'src/client/modules/event/classes/event-data.class';

@Component({
	selector: 'orc-nav-primary',
	standalone: false,
	templateUrl: './nav-primary.component.html',
	styleUrl: './nav-primary.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPrimaryComponent {
	public user_name = input.required<string | null>();
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

	@Output() save = new EventEmitter<void>();
	@Output() cancel = new EventEmitter<void>();
	@Output() abort = new EventEmitter<void>();

	constructor() {}
}
