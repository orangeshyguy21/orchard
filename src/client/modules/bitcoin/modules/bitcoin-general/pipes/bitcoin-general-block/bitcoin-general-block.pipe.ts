/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'bitcoinGeneralBlock',
	standalone: false,
	pure: false,
})
export class BitcoinGeneralBlockPipe implements PipeTransform {
	transform(value: number | string | undefined | null): string {
		if (!value) return '';
		const block_height = value.toString().replace(/\s/g, '');
		return block_height.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}
}
