/* Core Dependencies */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
/* Application Dependencies */
import { EventData } from '@client/modules/event/classes/event-data.class';

@Component({
	selector: 'orc-primary-nav-footer',
	standalone: false,
	templateUrl: './primary-nav-footer.component.html',
	styleUrl: './primary-nav-footer.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavFooterComponent {
  
  	@Input() active_section: string = '';
	@Input() active_event!: EventData | null;

	@Output() save : EventEmitter<void> = new EventEmitter();

}
