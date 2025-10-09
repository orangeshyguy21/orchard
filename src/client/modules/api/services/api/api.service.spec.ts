/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
/* Local Dependencies */
import {ApiService} from './api.service';

describe('ApiService', () => {
	let service: ApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(ApiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
