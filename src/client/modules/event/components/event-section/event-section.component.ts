import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-event-section',
	standalone: false,
	templateUrl: './event-section.component.html',
	styleUrl: './event-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSectionComponent {
	constructor() {}
}
