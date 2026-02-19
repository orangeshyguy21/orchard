/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';

@Component({
	selector: 'orc-settings-subsection-app-bitcoin',
	standalone: false,
	templateUrl: './settings-subsection-app-bitcoin.component.html',
	styleUrl: './settings-subsection-app-bitcoin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppBitcoinComponent {
	public bitcoin_enabled = input.required<boolean>();
	public form_group = input.required<FormGroup>();
	public oracle_price = input.required<BitcoinOraclePrice | null>();
	public update_oracle = output<void>();
}
