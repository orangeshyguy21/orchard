/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';
/* Vendor Dependencies */
import {DateTime} from 'luxon';

@Pipe({
	name: 'localTimeAgo',
	standalone: false,
	pure: false,
})
export class LocalTimeAgoPipe implements PipeTransform {
	transform(timestamp: number | null | undefined): string {
		if (!timestamp) return '';
		const date = DateTime.fromSeconds(timestamp);
		const relative = date.toRelative();
		return relative ? relative : '';
	}
}
