/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
/* Local Dependencies */
import {LocalTimePipe} from './local-time.pipe';

describe('LocalTimePipe', () => {
	let pipe: LocalTimePipe;
	let setting_device_service: jasmine.SpyObj<SettingDeviceService>;
	const timestamp = 1704110400; // 2024-01-01 12:00:00 UTC

	beforeEach(() => {
		const mock = jasmine.createSpyObj('SettingDeviceService', ['getTimezone', 'getLocale']);
		mock.getTimezone.and.returnValue('UTC');
		mock.getLocale.and.returnValue('en-US');
		TestBed.configureTestingModule({
			providers: [LocalTimePipe, {provide: SettingDeviceService, useValue: mock}],
		});
		pipe = TestBed.inject(LocalTimePipe);
		setting_device_service = TestBed.inject(SettingDeviceService) as jasmine.SpyObj<SettingDeviceService>;
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('returns empty string for null', () => {
		expect(pipe.transform(null)).toBe('');
	});

	it('returns empty string for undefined', () => {
		expect(pipe.transform(undefined)).toBe('');
	});

	it('returns empty string for 0', () => {
		expect(pipe.transform(0)).toBe('');
	});

	it('formats with default medium when no format passed', () => {
		const result = pipe.transform(timestamp);
		expect(result).toBeTruthy();
		expect(result).toContain('2024');
	});

	it('formats short', () => {
		const result = pipe.transform(timestamp, 'short');
		expect(result).toBeTruthy();
	});

	it('formats medium', () => {
		const result = pipe.transform(timestamp, 'medium');
		expect(result).toBeTruthy();
		expect(result).toContain('2024');
	});

	it('formats long', () => {
		const result = pipe.transform(timestamp, 'long');
		expect(result).toBeTruthy();
		expect(result).toContain('2024');
	});

	it('formats full', () => {
		const result = pipe.transform(timestamp, 'full');
		expect(result).toBeTruthy();
		expect(result).toContain('2024');
	});

	it('formats time-only without date', () => {
		const result = pipe.transform(timestamp, 'time-only');
		expect(result).toBeTruthy();
		expect(result).not.toContain('2024');
	});

	it('formats date-only without AM/PM', () => {
		const result = pipe.transform(timestamp, 'date-only');
		expect(result).toBeTruthy();
		expect(result).not.toMatch(/AM|PM/);
	});

	it('falls back to bare timezone when format token is unknown', () => {
		// Default switch path — no dateStyle/timeStyle set, only timeZone in options.
		// Intl.DateTimeFormat returns a date-only string in that case.
		const result = pipe.transform(timestamp, 'unrecognized');
		expect(result).toBeTruthy();
	});

	it('reads timezone and locale from SettingDeviceService', () => {
		pipe.transform(timestamp);
		expect(setting_device_service.getTimezone).toHaveBeenCalled();
		expect(setting_device_service.getLocale).toHaveBeenCalled();
	});

	it('uses the configured timezone', () => {
		setting_device_service.getTimezone.and.returnValue('America/New_York');
		const ny = pipe.transform(timestamp, 'time-only');
		setting_device_service.getTimezone.and.returnValue('UTC');
		const utc = pipe.transform(timestamp, 'time-only');
		expect(ny).not.toBe(utc);
	});
});
