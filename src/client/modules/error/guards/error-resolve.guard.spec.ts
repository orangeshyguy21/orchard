import {TestBed} from '@angular/core/testing';
import {CanActivateFn} from '@angular/router';

import {errorResolveGuard} from './error-resolve.guard';

describe('errorResolveGuard', () => {
	const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => errorResolveGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});
});
