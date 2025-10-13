/* Core Dependencies */
import { TestBed } from '@angular/core/testing';
/* Local Dependencies */
import { ConfigService } from './config.service';

describe('ConfigService', () => {
	let service: ConfigService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ConfigService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
