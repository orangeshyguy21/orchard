import {TestBed} from '@angular/core/testing';
import {CanActivateChildFn} from '@angular/router';

import {initializationGuard} from './initialization.guard';

describe('initializationGuard', () => {
	const executeGuard: CanActivateChildFn = (...guardParameters) =>
		TestBed.runInInjectionContext(() => initializationGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});
});
