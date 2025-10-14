import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-event-subsection-log',
	standalone: false,
	templateUrl: './event-subsection-log.component.html',
	styleUrl: './event-subsection-log.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogComponent {}
