/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'block',
	standalone: false,
	pure: false,
})
export class BlockPipe implements PipeTransform {
	transform(value: number | string | undefined | null): string {
		if (!value) return '';
		const block_height = value.toString().replace(/\s/g, '');
		return block_height.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}
}
