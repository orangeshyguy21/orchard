/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Local Dependencies */
import {ChartService} from './chart.service';

describe('ChartService', () => {
	let service: ChartService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideLuxonDateAdapter()],
		});
		service = TestBed.inject(ChartService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
