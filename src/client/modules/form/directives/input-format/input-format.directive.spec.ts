/* Core Dependencies */
import {ElementRef} from '@angular/core';
/* Local Dependencies */
import {InputFormatDirective} from './input-format.directive';

describe('InputFormatDirective', () => {
	it('should create an instance', () => {
		const element_ref = {nativeElement: document.createElement('input')} as ElementRef<HTMLInputElement>;
		const mock_ng_control = {control: {markAsTouched: () => {}}, valueAccessor: null} as any;
		const directive = new InputFormatDirective(element_ref, mock_ng_control);
		expect(directive).toBeTruthy();
	});
});
