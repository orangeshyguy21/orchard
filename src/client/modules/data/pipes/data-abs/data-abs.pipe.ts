/* Core Dependencies */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'dataAbs',
	standalone: false,
	pure: true,
})
export class DataAbsPipe implements PipeTransform {
	/** Returns the absolute value of a number */
	transform(value: number | null | undefined): number {
		if (value == null) return 0;
		return Math.abs(value);
	}
}
