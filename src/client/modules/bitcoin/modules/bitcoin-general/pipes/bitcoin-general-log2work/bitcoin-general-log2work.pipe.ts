/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'bitcoinGeneralLog2work',
	standalone: false,
	pure: false,
})
export class BitcoinGeneralLog2workPipe implements PipeTransform {
	transform(chainwork: string | null | undefined): number {
		if (!chainwork) return 0;
		const chainworkDecimal = parseInt(chainwork, 16);
		return Number(Math.log2(chainworkDecimal).toFixed(6));
	}
}
