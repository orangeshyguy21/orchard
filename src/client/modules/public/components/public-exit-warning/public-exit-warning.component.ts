/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
/* Vendor Dependencies */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'orc-public-exit-warning',
    standalone: false,
    templateUrl: './public-exit-warning.component.html',
    styleUrl: './public-exit-warning.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicExitWarningComponent {
    constructor(
        private readonly dialog_ref: MatDialogRef<PublicExitWarningComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {link: string},
    ) {}

    /** Opens the link in a new tab and closes the dialog */
    public onProceed(): void {
        window.open(this.data.link, '_blank', 'noopener,noreferrer');
        this.dialog_ref.close();
    }
}
