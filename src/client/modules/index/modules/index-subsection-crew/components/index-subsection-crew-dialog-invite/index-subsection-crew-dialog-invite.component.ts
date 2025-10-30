/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
/* Application Dependencies */
import {Invite} from '@client/modules/crew/classes/invite.class';

@Component({
	selector: 'orc-index-subsection-crew-dialog-invite',
	standalone: false,
	templateUrl: './index-subsection-crew-dialog-invite.component.html',
	styleUrl: './index-subsection-crew-dialog-invite.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewDialogInviteComponent {
	constructor(
		public dialogRef: MatDialogRef<IndexSubsectionCrewDialogInviteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: {invite: Invite},
	) {}
}
