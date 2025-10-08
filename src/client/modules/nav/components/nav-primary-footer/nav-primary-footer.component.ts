/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
/* Application Dependencies */
import {EventData} from '@client/modules/event/classes/event-data.class';

@Component({
	selector: 'orc-nav-primary-footer',
	standalone: false,
	templateUrl: './nav-primary-footer.component.html',
	styleUrl: './nav-primary-footer.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPrimaryFooterComponent {
	@Input() active_section: string = '';
	@Input() active_event!: EventData | null;

	@Output() save: EventEmitter<void> = new EventEmitter();
	@Output() cancel: EventEmitter<void> = new EventEmitter();
}
