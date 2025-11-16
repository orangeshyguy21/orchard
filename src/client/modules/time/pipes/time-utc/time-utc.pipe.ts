/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';

@Pipe({
	name: 'timeUtc',
	standalone: false,
	pure: true,
})
export class TimeUtcPipe implements PipeTransform {
	constructor(private settingDeviceService: SettingDeviceService) {}

	/**
	 * Converts a unix timestamp (in seconds) to a formatted date string in UTC timezone
	 * @param {number | null | undefined} unix_timestamp - Unix timestamp in seconds
	 * @param {string} format - Format type: 'short', 'medium', 'long', 'full', 'time-only', 'date-only'
	 * @returns {string} Formatted date string in UTC timezone
	 */
	transform(unix_timestamp: number | null | undefined, format: string = 'medium'): string {
		if (!unix_timestamp) return '';

		const date = new Date(unix_timestamp * 1000);
		const locale = this.settingDeviceService.getLocale();
		const options: Intl.DateTimeFormatOptions = {
			timeZone: 'UTC',
		};

		switch (format) {
			case 'short':
				options.dateStyle = 'short';
				options.timeStyle = 'short';
				break;
			case 'medium':
				options.dateStyle = 'medium';
				options.timeStyle = 'medium';
				break;
			case 'long':
				options.dateStyle = 'long';
				options.timeStyle = 'long';
				break;
			case 'full':
				options.dateStyle = 'full';
				options.timeStyle = 'full';
				break;
			case 'time-only':
				options.timeStyle = 'medium';
				break;
			case 'date-only':
				options.dateStyle = 'medium';
				break;
		}

		return new Intl.DateTimeFormat(locale, options).format(date);
	}
}
