import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  	name: 'unit',
	standalone: false,
	pure: true
})
export class UnitPipe implements PipeTransform {

	transform(unit: string): string {
		if (unit === null || unit === undefined) return '';
		const unit_lower = unit.toLowerCase();
		
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
				return unit;
		}
	}
}