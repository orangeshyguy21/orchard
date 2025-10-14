/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {ChartService} from './chart.service';

describe('ChartService', () => {
	let service: ChartService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ChartService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
