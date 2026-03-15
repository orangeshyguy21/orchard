import {LocalCronPipe} from './local-cron.pipe';

describe('LocalCronPipe', () => {
	let pipe: LocalCronPipe;

	beforeEach(() => {
		pipe = new LocalCronPipe();
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return empty string for null', () => {
		expect(pipe.transform(null)).toBe('');
	});

	it('should describe sub-hourly', () => {
		expect(pipe.transform('*/15 * * * *')).toBe('every 15 min');
	});

	it('should describe hourly', () => {
		expect(pipe.transform('0 * * * *')).toBe('every hour');
	});

	it('should describe every N hours', () => {
		expect(pipe.transform('0 */6 * * *')).toBe('every 6 hours');
	});

	it('should describe weekly', () => {
		expect(pipe.transform('0 9 * * 1')).toBe('every Monday');
	});

	it('should describe monthly', () => {
		expect(pipe.transform('0 9 15 * *')).toBe('monthly on day 15');
	});

	it('should describe daily', () => {
		expect(pipe.transform('30 14 * * *')).toBe('daily at 14:30');
	});

	it('should return raw cron for unrecognized patterns', () => {
		expect(pipe.transform('0 9 1 6 *')).toBe('0 9 1 6 *');
	});
});
