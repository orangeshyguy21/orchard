/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';

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
	public update = output<void>();
}
