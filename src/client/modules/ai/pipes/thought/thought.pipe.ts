/* Core Dependencies */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'thought',
	standalone: false,
	pure: true
})
export class ThoughtPipe implements PipeTransform {

	transform(value: number): string {
		if (!value || value < 0) {
			return 'Thought for a second';
		}

		const seconds = Math.floor(value / 1000);
		const minutes = Math.floor(seconds / 60);

		if (seconds < 1) {
			return 'Thought for a second';
		} else if (seconds < 5) {
			return 'Thought for a few seconds';
		} else if (seconds < 60) {
			return `Thought for ${seconds} seconds`;
		} else if (minutes < 2) {
			return 'Thought for a few minutes';
		} else {
			return `Thought for ${minutes} minutes`;
		}
	}
}