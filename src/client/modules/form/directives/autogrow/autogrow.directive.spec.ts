/* Core Dependencies */
import {ElementRef} from '@angular/core';
/* Local Dependencies */
import {AutogrowDirective} from './autogrow.directive';

describe('AutogrowDirective', () => {
	it('should create an instance', () => {
		const element_ref = new ElementRef(document.createElement('textarea'));
		const directive = new AutogrowDirective(element_ref);
		expect(directive).toBeTruthy();
	});
});
