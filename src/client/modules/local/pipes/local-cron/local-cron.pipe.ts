/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'localCron',
	standalone: false,
	pure: true,
})
export class LocalCronPipe implements PipeTransform {
	/** Converts a cron expression into a human-friendly schedule label */
	transform(cron: string | null | undefined): string {
		if (!cron) return '';
		const parts = cron.trim().split(/\s+/);
		if (parts.length !== 5) return cron;
		const [minute, hour, day_of_month, month, day_of_week] = parts;

		const day_names: Record<string, string> = {
			'0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday',
			'4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday',
		};

		/* Sub-hourly: */
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
			const day_label = day_names[day_of_week] ?? day_of_week;
			return `every ${day_label}`;
		}

		/* Monthly */
		if (day_of_month !== '*' && day_of_week === '*' && month === '*') {
			return `monthly on day ${day_of_month}`;
		}

		/* Daily */
		if (day_of_month === '*' && day_of_week === '*' && month === '*') {
			return `daily at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
		}

		return cron;
	}
}
