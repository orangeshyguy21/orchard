/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'dataTruncate',
	standalone: false,
	pure: true,
})
export class DataTruncatePipe implements PipeTransform {
	transform(value: string | null | undefined, max_length: number = 50, start_chars: number = 20, end_chars: number = 12): string {
		if (!value || typeof value !== 'string') return '';
		if (value.length <= max_length) return value;
		const beginning = value.substring(0, start_chars);
		const ending = value.substring(value.length - end_chars);
		return `${beginning}...${ending}`;
	}
}
