/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';

@Component({
	selector: 'orc-settings-subsection-app-bitcoin-oracle',
	standalone: false,
	templateUrl: './settings-subsection-app-bitcoin-oracle.component.html',
	styleUrl: './settings-subsection-app-bitcoin-oracle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppBitcoinOracleComponent {
	public form_group = input.required<FormGroup>();
	public control_name = input.required<string>();
	public oracle_price = input.required<BitcoinOraclePrice | null>();
	public update = output<void>();

	public help_status = signal<boolean>(false);
}
