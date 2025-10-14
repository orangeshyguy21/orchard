/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {AiService} from './ai.service';

describe('AiService', () => {
	let service: AiService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
