/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Vendor Dependencies */
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
/* Native Dependencies */
import { MintConfigFormEnabledConfirmComponent } from '../mint-config-form-enabled-confirm/mint-config-form-enabled-confirm.component';

@Component({
	selector: 'orc-mint-config-form-enabled',
	standalone: false,
	templateUrl: './mint-config-form-enabled.component.html',
	styleUrl: './mint-config-form-enabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormEnabledComponent {

	@Input() nut!: 'nut4' | 'nut5';
	@Input() form_group!: FormGroup;

	@Output() update = new EventEmitter<{form_group: FormGroup, nut: 'nut4' | 'nut5'}>();

	@ViewChild('toggle') toggle!: MatSlideToggle;

	constructor(
		private dialog: MatDialog,
	) {}

	public onChange(event: MatSlideToggleChange): void {
		( event.checked ) ? this.onConfirm(true) : this.launchDialog();
	}

	private launchDialog(): void {
		const dialog_ref = this.dialog.open(MintConfigFormEnabledConfirmComponent, {
			data: { nut: this.nut },
		});
		dialog_ref.afterClosed().subscribe( decision => {
			( decision === true ) ? this.onConfirm(false) : this.onCancel();
		});
	}

	private onConfirm(value: boolean): void {
		this.form_group.get('enabled')?.setValue(value);
		this.update.emit({form_group: this.form_group, nut: this.nut});
	}

	private onCancel(): void {
		this.toggle.checked = true;
		this.form_group.get('enabled')?.setValue(true);
	}
}