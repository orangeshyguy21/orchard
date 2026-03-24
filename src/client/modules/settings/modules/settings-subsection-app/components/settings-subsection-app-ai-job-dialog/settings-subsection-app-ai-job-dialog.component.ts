/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
/* Vendor Dependencies */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
	selector: 'orc-settings-subsection-app-ai-job-dialog',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-job-dialog.component.html',
	styleUrl: './settings-subsection-app-ai-job-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiJobDialogComponent {
	public readonly dialogRef = inject(MatDialogRef<SettingsSubsectionAppAiJobDialogComponent>);
	public readonly data: {name: string} = inject(MAT_DIALOG_DATA);
}
