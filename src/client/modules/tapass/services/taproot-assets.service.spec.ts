/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {TaprootAssetsService} from './taproot-assets.service';

describe('TaprootAssetsService', () => {
	let service: TaprootAssetsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TaprootAssetsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
