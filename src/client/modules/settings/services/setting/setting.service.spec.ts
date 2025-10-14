/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {SettingService} from './setting.service';

describe('SettingService', () => {
	let service: SettingService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SettingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
