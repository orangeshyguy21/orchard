/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'dataBytes',
	standalone: false,
	pure: true,
})
export class DataBytesPipe implements PipeTransform {
	transform(bytes: number | null | undefined): string {
		if (bytes === 0 || bytes === null || bytes === undefined) return '0 B';

		const units = ['B', 'kB', 'MB', 'GB', 'TB'];
		const k = 1024;
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
	}
}
