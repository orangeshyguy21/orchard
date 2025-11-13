/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-settings-subsection-app-bitcoin',
	standalone: false,
	templateUrl: './settings-subsection-app-bitcoin.component.html',
	styleUrl: './settings-subsection-app-bitcoin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppBitcoinComponent {
	public form_group = input.required<FormGroup>();
	public update_oracle = output<void>();
}
