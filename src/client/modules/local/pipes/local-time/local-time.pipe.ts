/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';

@Pipe({
	name: 'localTime',
	standalone: false,
	pure: true,
})
export class LocalTimePipe implements PipeTransform {
	constructor(private settingDeviceService: SettingDeviceService) {}

	transform(unix_timestamp: number | null | undefined, format: string = 'medium'): string {
		if (!unix_timestamp) return '';
		const date = new Date(unix_timestamp * 1000);
		const timezone = this.settingDeviceService.getTimezone();
		const locale = this.settingDeviceService.getLocale();
		const options: Intl.DateTimeFormatOptions = {
			timeZone: timezone,
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
