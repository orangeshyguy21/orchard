/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
/* Local Dependencies */
import {TimeUtcPipe} from './time-utc.pipe';

/**
 * Test suite for TimeUtcPipe
 * Tests UTC timestamp formatting with various formats
 */
describe('TimeUtcPipe', () => {
	let pipe: TimeUtcPipe;
	let setting_device_service: jasmine.SpyObj<SettingDeviceService>;

	beforeEach(() => {
		const mock_setting_device_service = jasmine.createSpyObj('SettingDeviceService', ['getLocale']);
		mock_setting_device_service.getLocale.and.returnValue('en-US');

		TestBed.configureTestingModule({
			providers: [TimeUtcPipe, {provide: SettingDeviceService, useValue: mock_setting_device_service}],
		});

		pipe = TestBed.inject(TimeUtcPipe);
		setting_device_service = TestBed.inject(SettingDeviceService) as jasmine.SpyObj<SettingDeviceService>;
	});

	/**
	 * Test pipe instantiation
	 */
	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	/**
	 * Test null/undefined handling
	 */
	it('should return empty string for null timestamp', () => {
		expect(pipe.transform(null)).toBe('');
	});

	it('should return empty string for undefined timestamp', () => {
		expect(pipe.transform(undefined)).toBe('');
	});

	it('should return empty string for 0 timestamp', () => {
		expect(pipe.transform(0)).toBe('');
	});

	/**
	 * Test various format options
	 */
	it('should format timestamp with default medium format', () => {
		// arrange - Jan 1, 2024 12:00:00 UTC
		const timestamp = 1704110400;

		// act
		const result = pipe.transform(timestamp);

		// assert - should contain date and time
		expect(result).toBeTruthy();
		expect(result.length).toBeGreaterThan(0);
	});

	it('should format timestamp with short format', () => {
		// arrange
		const timestamp = 1704110400;

		// act
		const result = pipe.transform(timestamp, 'short');

		// assert
		expect(result).toBeTruthy();
	});

	it('should format timestamp with long format', () => {
		// arrange
		const timestamp = 1704110400;

		// act
		const result = pipe.transform(timestamp, 'long');

		// assert
		expect(result).toBeTruthy();
	});

	it('should format timestamp with full format', () => {
		// arrange
		const timestamp = 1704110400;

		// act
		const result = pipe.transform(timestamp, 'full');

		// assert
		expect(result).toBeTruthy();
	});

	it('should format timestamp with time-only format', () => {
		// arrange
		const timestamp = 1704110400;

		// act
		const result = pipe.transform(timestamp, 'time-only');

		// assert
		expect(result).toBeTruthy();
		// time-only should not contain full date information
		expect(result).not.toContain('2024');
	});

	it('should format timestamp with date-only format', () => {
		// arrange
		const timestamp = 1704110400;

		// act
		const result = pipe.transform(timestamp, 'date-only');

		// assert
		expect(result).toBeTruthy();
		// date-only should not contain time information like AM/PM
		expect(result).not.toMatch(/AM|PM/);
	});

	/**
	 * Test locale usage
	 */
	it('should use locale from SettingDeviceService', () => {
		// arrange
		const timestamp = 1704110400;

		// act
		pipe.transform(timestamp);

		// assert
		expect(setting_device_service.getLocale).toHaveBeenCalled();
	});

	/**
	 * Test UTC timezone handling
	 */
	it('should format timestamp in UTC timezone', () => {
		// arrange - Jan 1, 2024 00:00:00 UTC (midnight)
		const timestamp = 1704067200;

		// act - format in date-only to check UTC is used
		const result = pipe.transform(timestamp, 'date-only');

		// assert - should contain date information
		expect(result).toBeTruthy();
		expect(result).toContain('2024');
	});
});
