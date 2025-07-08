/* Core Dependencies */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'log2work',
	standalone: false,
	pure: false
})
export class Log2WorkPipe implements PipeTransform {
	transform(chainwork: string | null | undefined): number {
		if (!chainwork) return 0;
		const chainworkDecimal = parseInt(chainwork, 16);
		return Number(Math.log2(chainworkDecimal).toFixed(6));
	}
}