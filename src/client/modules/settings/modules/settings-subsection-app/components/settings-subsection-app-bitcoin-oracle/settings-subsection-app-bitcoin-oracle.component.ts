/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject, input, output, signal, computed} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
/* Application Dependencies */
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Native Dependencies */
import {PublicExitWarningComponent} from '@client/modules/public/components/public-exit-warning/public-exit-warning.component';
/* Shared Dependencies */
import {UtxOracleProgressStatus} from '@shared/generated.types';

@Component({
	selector: 'orc-settings-subsection-app-bitcoin-oracle',
	standalone: false,
	templateUrl: './settings-subsection-app-bitcoin-oracle.component.html',
	styleUrl: './settings-subsection-app-bitcoin-oracle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppBitcoinOracleComponent {
	private readonly dialog = inject(MatDialog);

	public bitcoin_enabled = input.required<boolean>();
	public bitcoin_oracle_enabled = input.required<boolean>();
	public form_group = input.required<FormGroup>();
	public control_name = input.required<string>();
	public oracle_price = input.required<BitcoinOraclePrice | null>();
	public oracle_running = input.required<boolean>();
	public oracle_progress = input.required<number>();
	public oracle_status = input.required<UtxOracleProgressStatus | null>();
	public device_type = input.required<DeviceType>();

	public update = output<void>();
	public oracleAsked = output<void>();

	public help_status = signal<boolean>(false);

	public derived_status = computed(() => {
		if (!this.oracle_running()) return null;
		return this.oracle_status();
	});

	/** Toggles the oracle form control and emits an update */
	public toggleOracle(status: boolean): void {
		this.form_group().get(this.control_name())?.setValue(status);
		this.form_group().get(this.control_name())?.markAsDirty();
		this.form_group().get(this.control_name())?.markAsTouched();
		this.update.emit();
	}

	/** Opens the exit warning dialog for an external link */
	public onExternalLink(link: string): void {
		this.dialog.open(PublicExitWarningComponent, {data: {link}});
	}
}
