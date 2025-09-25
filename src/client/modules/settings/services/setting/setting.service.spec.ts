import {TestBed} from '@angular/core/testing';

import {SettingService} from './setting.service';

describe('LocaleService', () => {
	let service: SettingService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SettingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
