import {TestBed} from '@angular/core/testing';
import {CanActivateFn} from '@angular/router';

import {uninitializedGuard} from './uninitialized.guard';

describe('uninitializedGuard', () => {
	const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => uninitializedGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});
});
