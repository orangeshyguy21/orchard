/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {CurrencyType} from '@client/modules/cache/services/local-storage/local-storage.types';
/* Native Dependencies */
import {getCurrencySymbol} from '@client/modules/local/helpers/local.helpers';

@Pipe({
	name: 'localAmount',
	standalone: false,
	pure: true,
})
export class LocalAmountPipe implements PipeTransform {
	constructor(private settingDeviceService: SettingDeviceService) {}

	transform(amount: number | null, unit: string, section?: string): string {
		if (amount === null || amount === undefined) return '';
		const locale = this.settingDeviceService.getLocale();
		const currency = this.settingDeviceService.getCurrency();
		const unit_lower = unit.toLowerCase();

		switch (unit_lower) {
			case 'sat':
				return this.transformSat(amount, locale, currency.type_btc);
			case 'btc':
				return this.transformBtc(amount, locale);
			case 'usd':
				return this.transformFiat(amount, unit, locale, currency.type_fiat, section);
			case 'eur':
				return this.transformFiat(amount, unit, locale, currency.type_fiat, section);
			default:
				return this.formatStandard(amount.toLocaleString(), unit);
		}
	}

	private transformSat(amount: number, locale: string, currency: CurrencyType): string {
		const sat_string = amount.toLocaleString(locale);
		switch (currency) {
			case CurrencyType.GLYPH:
				return this.formatPreceding(sat_string, '₿');
			case CurrencyType.CODE:
				return this.formatStandard(sat_string, 'sat');
			default:
				return this.formatStandard(sat_string, 'sat');
		}
	}

	private transformBtc(amount: number, locale: string): string {
		const suffix = 'BTC';
		const btc_string = amount.toLocaleString(locale, {minimumFractionDigits: 8, maximumFractionDigits: 8});
		return this.formatStandard(btc_string, suffix);
	}

	private transformFiat(amount: number, unit: string, locale: string, currency: CurrencyType, section?: string): string {
		let fiat_amount = amount;
		if (section === 'mint') fiat_amount = LocalAmountPipe.getConvertedAmount(unit, amount);
		const fiat_amount_string = fiat_amount.toLocaleString(locale, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		switch (currency) {
			case CurrencyType.GLYPH:
				return this.formatPreceding(fiat_amount_string, getCurrencySymbol(unit.toLowerCase()));
			case CurrencyType.CODE:
				return this.formatStandard(fiat_amount_string, unit.toUpperCase());
			default:
				return this.formatStandard(fiat_amount_string, unit.toUpperCase());
		}
	}

	private formatStandard(amount_string: string, unit: string): string {
		return `
			<span class="orc-amount-standard">
				<span class="orc-amount">
					${amount_string}
				</span>
				<span class="orc-unit">
					${unit}
				</span>
			</span>
		`;
	}

	private formatPreceding(amount_string: string, unit: string): string {
		return `
            <span class="orc-unit">
                ${unit}
            </span>
            <span class="orc-amount">
                ${amount_string}
            </span>
        `;
	}

	public static getConvertedAmount(unit: string, amount: number): number {
		switch (unit.toLowerCase()) {
			case 'sat':
				return amount;
			case 'btc':
				return amount;
			case 'usd':
				return amount / 100;
			case 'eur':
				return amount / 100;
			default:
				return amount;
		}
	}
}
