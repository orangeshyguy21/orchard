/* Core Dependencies */
import {Injectable} from '@angular/core';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {CurrencyType} from '@client/modules/cache/services/local-storage/local-storage.types';
/* Native Dependencies */
import {getCurrencySymbol} from '@client/modules/local/helpers/local.helpers';

@Injectable({
	providedIn: 'root',
})
export class LocalService {
	constructor(private settingDeviceService: SettingDeviceService) {}

	public getCurrencyUnitDisplay(unit: string): string {
		const unit_lower = unit.toLowerCase();
		const currency = this.settingDeviceService.getCurrency();
		switch (unit_lower) {
			case 'sat':
				return currency.type_btc === CurrencyType.GLYPH ? '₿' : 'sat';
			case 'usd':
				return currency.type_fiat === CurrencyType.CODE ? unit.toUpperCase() : getCurrencySymbol(unit_lower);
			case 'eur':
				return currency.type_fiat === CurrencyType.CODE ? unit.toUpperCase() : getCurrencySymbol(unit_lower);
			default:
				return unit.toUpperCase();
		}
	}
}
