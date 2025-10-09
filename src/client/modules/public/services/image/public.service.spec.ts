/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
/* Local Dependencies */
import {PublicService} from './public.service';

describe('PublicService', () => {
	let service: PublicService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(PublicService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
