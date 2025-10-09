/* Core Dependencies */
import {ElementRef} from '@angular/core';
/* Local Dependencies */
import {FormNumberSeparatorDirective} from './form-number-separator.directive';

describe('FormNumberSeparatorDirective', () => {
	it('should create an instance', () => {
		const element_ref = {nativeElement: document.createElement('input')} as ElementRef<HTMLInputElement>;
		const mock_ng_control = {control: {markAsTouched: () => {}}, valueAccessor: null} as any;
		const directive = new FormNumberSeparatorDirective(element_ref, mock_ng_control);
		expect(directive).toBeTruthy();
	});
});
