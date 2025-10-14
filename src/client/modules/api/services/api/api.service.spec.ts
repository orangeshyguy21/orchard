/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {ApiService} from './api.service';

describe('ApiService', () => {
	let service: ApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ApiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
