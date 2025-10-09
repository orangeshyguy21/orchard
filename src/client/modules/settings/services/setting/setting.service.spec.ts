/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Local Dependencies */
import {SettingService} from './setting.service';

describe('SettingService', () => {
	let service: SettingService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideLuxonDateAdapter()],
		});
		service = TestBed.inject(SettingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
