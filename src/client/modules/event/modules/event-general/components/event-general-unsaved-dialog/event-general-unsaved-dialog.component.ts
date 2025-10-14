/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
/* Vendor Dependencies */
import {MatDialogRef} from '@angular/material/dialog';

@Component({
	selector: 'orc-event-general-unsaved-dialog',
	standalone: false,
	templateUrl: './event-general-unsaved-dialog.component.html',
	styleUrl: './event-general-unsaved-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventGeneralUnsavedDialogComponent {
	constructor(public dialog_ref: MatDialogRef<EventGeneralUnsavedDialogComponent>) {}
}
