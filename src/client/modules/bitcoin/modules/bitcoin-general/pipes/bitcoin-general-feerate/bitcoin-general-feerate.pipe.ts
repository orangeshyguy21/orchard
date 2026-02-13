import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'bitcoinGeneralFeerate',
	standalone: false,
	pure: true,
})
export class BitcoinGeneralFeeratePipe implements PipeTransform {
	transform(value: number | null | undefined, mode?: 'ceil1'): number | null {
		if (value === null || value === undefined || isNaN(value)) return null;
		const sat_vbyte = (value * 100_000_000) / 1_000;
		if (mode === 'ceil1') return Math.ceil(sat_vbyte * 10) / 10;
		return Math.round(sat_vbyte * 100) / 100;
	}
}
