/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'bytes',
	standalone: false,
	pure: false,
})
export class BytesPipe implements PipeTransform {
	transform(bytes: number | null | undefined): string {
		if (bytes === 0 || bytes === null || bytes === undefined) return '0 B';

		const units = ['B', 'KB', 'MB', 'GB', 'TB'];
		const k = 1024;
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
	}
}
