/* Core Dependencies */
import { Pipe, PipeTransform } from '@angular/core';
/* Application Dependencies */
import { SettingService } from '@client/modules/settings/services/setting/setting.service';

@Pipe({
	name: 'amount',
	standalone: false,
	pure: false
})
export class AmountPipe implements PipeTransform {

	constructor(
		private settingService: SettingService
	) {}

	transform(amount: number, unit: string, section?: string): string {
		if (amount === null || amount === undefined) return '';
		const locale = this.settingService.getLocale();
		const unit_lower = unit.toLowerCase();
		
		switch (unit_lower) {
			case 'sat':
				return this.transformSat(amount);
			case 'btc':
				return this.transformBtc(amount, unit, locale);
			case 'usd':
				return this.transformFiat(amount, unit, locale, section);
			case 'eur':
				return this.transformFiat(amount, unit, locale, section);
			default:
				return `${amount.toLocaleString()} ${unit}`;
		}
	}

	private transformSat(amount: number): string {
		const suffix = (amount === 1) ? 'sat' : 'sats';
		const sat_string = amount.toLocaleString();
		return this.transformToHtml(sat_string, suffix);
	}

	private transformBtc(amount: number, unit: string, locale: string): string {
		const suffix = 'BTC';
		const btc_string = amount.toLocaleString(locale, { minimumFractionDigits: 8, maximumFractionDigits: 8 });
		return this.transformToHtml(btc_string, suffix);
	}

	private transformFiat(amount: number, unit: string, locale: string, section?: string): string {
		let fiat_amount = amount;
		if( section === 'mint' ) fiat_amount = amount/100;
		const fiat_amount_string = fiat_amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		const suffix = unit.toUpperCase();
		return this.transformToHtml(fiat_amount_string, suffix);
	}

	private transformToHtml(amount_string: string, unit: string) : string {
		return `
			<span class="orc-amount-container">
				<span class="orc-amount">
					${amount_string}
				</span>
				<span class="orc-unit">
					${unit}
				</span>
			</span>
		`;
	}
}
