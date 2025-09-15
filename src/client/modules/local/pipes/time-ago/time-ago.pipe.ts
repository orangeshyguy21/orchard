/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';
/* Vendor Dependencies */
import {DateTime} from 'luxon';

@Pipe({
	name: 'time_ago',
	standalone: false,
	pure: false,
})
export class TimeAgoPipe implements PipeTransform {
	transform(timestamp: number | null | undefined): string {
		if (!timestamp) return '';
		const date = DateTime.fromSeconds(timestamp);
		const relative = date.toRelative();
		return relative ? relative : '';
	}
}
