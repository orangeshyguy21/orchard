/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
/* Local Dependencies */
import {BitcoinService} from './bitcoin.service';

describe('BitcoinService', () => {
	let service: BitcoinService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(BitcoinService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
