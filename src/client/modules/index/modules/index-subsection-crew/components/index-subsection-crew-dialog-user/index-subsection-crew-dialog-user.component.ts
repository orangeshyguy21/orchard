/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
/* Application Dependencies */
import {User} from '@client/modules/crew/classes/user.class';

@Component({
	selector: 'orc-index-subsection-crew-dialog-user',
	standalone: false,
	templateUrl: './index-subsection-crew-dialog-user.component.html',
	styleUrl: './index-subsection-crew-dialog-user.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewDialogUserComponent {
	constructor(
		public dialogRef: MatDialogRef<IndexSubsectionCrewDialogUserComponent>,
		@Inject(MAT_DIALOG_DATA) public data: {user: User},
	) {}
}
