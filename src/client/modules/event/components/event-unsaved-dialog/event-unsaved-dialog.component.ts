/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
/* Vendor Dependencies */
import {MatDialogRef} from '@angular/material/dialog';

@Component({
	selector: 'orc-event-unsaved-dialog',
	standalone: false,
	templateUrl: './event-unsaved-dialog.component.html',
	styleUrl: './event-unsaved-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventUnsavedDialogComponent {
	constructor(public dialog_ref: MatDialogRef<EventUnsavedDialogComponent>) {}
}
