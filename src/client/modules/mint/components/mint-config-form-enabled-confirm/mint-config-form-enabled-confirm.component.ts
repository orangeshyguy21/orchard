/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
/* Native Dependencies */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'orc-mint-config-form-enabled-confirm',
	standalone: false,
	templateUrl: './mint-config-form-enabled-confirm.component.html',
	styleUrl: './mint-config-form-enabled-confirm.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormEnabledConfirmComponent {

	public get icon(): string {
		return (this.data.nut === 'nut4') ? 'minting_disabled_outline' : 'melting_disabled_outline';
	}

	public get description(): string {
		return (this.data.nut === 'nut4') ? 
		'Disabling minting will freeze deposits into the mint.<br>Confirm to disable.' : 
		'Disabling melting will freeze withdrawals from the mint.<br>Confirm to disable.';
	}

	constructor(
		public dialogRef: MatDialogRef<MintConfigFormEnabledConfirmComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { nut: 'nut4' | 'nut5' },
	) {}

}
