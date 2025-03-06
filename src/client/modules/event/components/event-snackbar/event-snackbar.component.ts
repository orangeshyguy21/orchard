/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
/* Native Dependencies */
import { EventData } from '@client/modules/event/classes/event-data.class';

@Component({
	selector: 'orc-event-snackbar',
	standalone: false,
	templateUrl: './event-snackbar.component.html',
	styleUrl: './event-snackbar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventSnackbarComponent {

	@Input() event!: EventData | null;

	// public moused = false;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
	) { }

	// public onMouseEnter(){
	// 	this.moused = true;
	// 	this.changeDetectorRef.detectChanges();
	// }

	// public onMouseLeave(){
	// 	this.moused = false;
	// 	this.changeDetectorRef.detectChanges();
	// }

	public onClick(){
		// probably actually do need a nav event oops
	}

}
