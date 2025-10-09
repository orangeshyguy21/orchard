/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
/* Local Dependencies */
import {LightningService} from './lightning.service';

describe('LightningService', () => {
	let service: LightningService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(LightningService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
