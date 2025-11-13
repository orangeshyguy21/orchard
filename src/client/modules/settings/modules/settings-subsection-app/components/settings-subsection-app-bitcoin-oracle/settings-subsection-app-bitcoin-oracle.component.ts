/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, computed} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
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

	public oracle_price_date = computed(() => {
		if (!this.oracle_price()?.date) return '';

		const date = new Date(this.oracle_price()!.date * 1000);
		const locale = this.settingDeviceService.getLocale();

		return new Intl.DateTimeFormat(locale, {
			timeZone: 'UTC',
			dateStyle: 'medium',
		}).format(date);
	});

	constructor(private settingDeviceService: SettingDeviceService) {}
}
