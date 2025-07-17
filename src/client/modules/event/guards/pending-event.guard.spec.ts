import {TestBed} from '@angular/core/testing';
import {CanDeactivateFn} from '@angular/router';
/* Application Dependencies */
import {ComponentCanDeactivate} from '@client/modules/routing/interfaces/routing.interfaces';
/* Local Dependencies */
import {pendingEventGuard} from './pending-event.guard';

describe('pendingEventGuard', () => {
	const executeGuard: CanDeactivateFn<ComponentCanDeactivate> = (...guardParameters) =>
		TestBed.runInInjectionContext(() => pendingEventGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});
});
