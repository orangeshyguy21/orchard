import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'feerate',
	standalone: false,
	pure: true,
})
export class FeeratePipe implements PipeTransform {
	transform(value: number | null | undefined): number | null {
		if (value === null || value === undefined || isNaN(value)) return null;
		const sat_vbyte = (value * 100_000_000) / 1_000;
		return Math.round(sat_vbyte * 100) / 100; // Round to 2 decimal places
	}
}
