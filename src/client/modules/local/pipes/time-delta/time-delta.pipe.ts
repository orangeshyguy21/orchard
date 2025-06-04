import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
	name: 'timeDelta',
	standalone: false,
	pure: false
})
export class TimeDeltaPipe implements PipeTransform {

	transform(start_timestamp: number|null|undefined, end_timestamp: number|null|undefined): string {
		if (!start_timestamp || !end_timestamp) return '';

		const start_date = DateTime.fromSeconds(start_timestamp);
		const end_date = DateTime.fromSeconds(end_timestamp);
		
		const diff_seconds = Math.abs(end_date.diff(start_date, 'seconds').seconds);
		
		if (diff_seconds < 120) {
			const seconds = Math.round(diff_seconds);
			return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
		} else if (diff_seconds < 3600) { // 60 minutes = 3600 seconds
			const minutes = Math.round(diff_seconds / 60);
			return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
		} else if (diff_seconds < 86400) { // 24 hours = 86400 seconds
			const hours = Math.round(diff_seconds / 3600);
			return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
		} else {
			const days = Math.round(diff_seconds / 86400);
			return `${days} ${days === 1 ? 'day' : 'days'}`;
		}
	}

}
