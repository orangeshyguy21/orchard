/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Local Dependencies */
import {AiService} from './ai.service';

describe('AiService', () => {
	let service: AiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideLuxonDateAdapter(), provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(AiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
