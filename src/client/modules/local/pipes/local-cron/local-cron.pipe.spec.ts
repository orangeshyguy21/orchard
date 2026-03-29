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

	it('should describe weekly with multiple days', () => {
		expect(pipe.transform('0 9 * * 1,3,5')).toBe('every Mon, Wed, Fri');
	});

	it('should describe monthly', () => {
		expect(pipe.transform('0 9 15 * *')).toBe('monthly on day 15');
	});

	it('should describe daily', () => {
		expect(pipe.transform('30 14 * * *')).toBe('daily at 14:30');
	});

	it('should describe daily with multiple hours', () => {
		expect(pipe.transform('0 1,6,12 * * *')).toBe('daily at 01:00, 06:00, 12:00');
	});

	it('should sort multiple hours numerically', () => {
		expect(pipe.transform('0 6,0,18 * * *')).toBe('daily at 00:00, 06:00, 18:00');
	});

	it('should return raw cron for unrecognized patterns', () => {
		expect(pipe.transform('0 9 1 6 *')).toBe('0 9 1 6 *');
	});
});
