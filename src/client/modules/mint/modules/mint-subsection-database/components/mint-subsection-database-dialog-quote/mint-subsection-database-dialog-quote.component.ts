/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
/* Vendor Dependencies */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
/* Application Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';

@Component({
	selector: 'orc-mint-subsection-database-dialog-quote',
	standalone: false,
	templateUrl: './mint-subsection-database-dialog-quote.component.html',
	styleUrl: './mint-subsection-database-dialog-quote.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseDialogQuoteComponent {
	constructor(
		public dialogRef: MatDialogRef<MintSubsectionDatabaseDialogQuoteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: {quote: MintMintQuote | MintMeltQuote},
	) {}
}
