/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'localCron',
	standalone: false,
	pure: true,
})
export class LocalCronPipe implements PipeTransform {
	private readonly day_names: Record<string, string> = {
		'0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday',
		'4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday',
	};

	private readonly short_day_names: Record<string, string> = {
		'0': 'Sun', '1': 'Mon', '2': 'Tue', '3': 'Wed',
		'4': 'Thu', '5': 'Fri', '6': 'Sat', '7': 'Sun',
	};

	/** Converts a cron expression into a human-friendly schedule label */
	transform(cron: string | null | undefined): string {
		if (!cron) return '';
		const parts = cron.trim().split(/\s+/);
		if (parts.length !== 5) return cron;
		const [minute, hour, day_of_month, month, day_of_week] = parts;

		/* Sub-hourly */
		if (hour === '*' && minute.startsWith('*/')) {
			return `every ${minute.slice(2)} min`;
		}

		/* Hourly */
		if (hour === '*') {
			return 'every hour';
		}

		/* Every N hours */
		if (hour.startsWith('*/')) {
			const hrs = parseInt(hour.slice(2), 10);
			return `every ${hrs} ${hrs === 1 ? 'hour' : 'hours'}`;
		}

		/* Weekly */
		if (day_of_month === '*' && day_of_week !== '*' && month === '*') {
			const days = day_of_week.split(',');
			if (days.length > 1) {
				const labels = days.map(d => this.short_day_names[d] ?? d);
				return `every ${labels.join(', ')}`;
			}
			return `every ${this.day_names[day_of_week] ?? day_of_week}`;
		}

		/* Monthly */
		if (day_of_month !== '*' && day_of_week === '*' && month === '*') {
			return `monthly on day ${day_of_month}`;
		}

		/* Daily at specific hours */
		if (day_of_month === '*' && day_of_week === '*' && month === '*') {
			const hours = hour.split(',');
			if (hours.length > 1) {
				const times = hours
					.map(h => parseInt(h, 10))
					.sort((a, b) => a - b)
					.map(h => `${String(h).padStart(2, '0')}:${minute.padStart(2, '0')}`);
				return `daily at ${times.join(', ')}`;
			}
			return `daily at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
		}

		return cron;
	}
}
