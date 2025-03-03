/* Core Dependencies */
import { Pipe, PipeTransform } from '@angular/core';
/* Application Dependencies */
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';

@Pipe({
	name: 'time',
	standalone: false,
	pure: false
})
export class TimePipe implements PipeTransform {

	constructor(
		private localStorageService: LocalStorageService
	) {}
	
	transform(unix_timestamp: number, format: string = 'medium'): string {
		if (!unix_timestamp) return '';
		const date = new Date(unix_timestamp * 1000);
		const timezone = this.localStorageService.getTimezone().tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone; 
		const locale = this.localStorageService.getLocale().code ?? Intl.DateTimeFormat().resolvedOptions().locale;
		const options: Intl.DateTimeFormatOptions = {
			timeZone: timezone
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