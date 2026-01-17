/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'localUnit',
	standalone: false,
	pure: true,
})
export class LocalUnitPipe implements PipeTransform {
	transform(unit: string, title: boolean = false): string {
		if (unit === null || unit === undefined) return '';
		const unit_lower = unit.toLowerCase();
		return title ? this.titleUnit(unit_lower) : this.trailingUnit(unit_lower);
	}

	private trailingUnit(unit_lower: string): string {
		switch (unit_lower) {
			case 'sat':
				return 'sat';
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
				return 'SAT';
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
