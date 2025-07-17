/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
/* Vendor Dependencies */
import {MatDialogRef} from '@angular/material/dialog';

@Component({
	selector: 'orc-pending-event',
	standalone: false,
	templateUrl: './pending-event.component.html',
	styleUrl: './pending-event.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingEventComponent {
	constructor(public dialog_ref: MatDialogRef<PendingEventComponent>) {}
}
