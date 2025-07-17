import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'unit',
	standalone: false,
	pure: true,
})
export class UnitPipe implements PipeTransform {
	transform(unit: string, title: boolean = false): string {
		if (unit === null || unit === undefined) return '';
		const unit_lower = unit.toLowerCase();
		return title ? this.titleUnit(unit_lower) : this.trailingUnit(unit_lower);
	}

	private trailingUnit(unit_lower: string): string {
		switch (unit_lower) {
			case 'sat':
				return 'sats';
			case 'btc':
				return 'BTC';
			case 'usd':
				return 'USD';
			case 'eur':
				return 'EUR';
			default:
				return unit_lower;
		}
	}

	private titleUnit(unit_lower: string): string {
		switch (unit_lower) {
			case 'sat':
				return 'Sat';
			case 'btc':
				return 'BTC';
			case 'usd':
				return 'USD';
			case 'eur':
				return 'EUR';
			default:
				return unit_lower;
		}
	}
}
