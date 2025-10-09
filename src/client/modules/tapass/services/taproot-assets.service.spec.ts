/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
/* Local Dependencies */
import {TaprootAssetsService} from './taproot-assets.service';

describe('TaprootAssetsService', () => {
	let service: TaprootAssetsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(TaprootAssetsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
