import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'fee',
	standalone: false,
	pure: false
})
export class FeePipe implements PipeTransform {

	transform(fee: number, section?: string): string {
		if (fee === null) return '';
		return `${this.transformPPK(fee)}%`;
	}

	private transformPPK(fee: number): number {
		return fee / 1000;
	}
	
}
