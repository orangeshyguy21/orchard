/* Local Dependencies */
import {DataAbsPipe} from './data-abs.pipe';

describe('DataAbsPipe', () => {
	const pipe = new DataAbsPipe();

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('returns absolute value of a negative number', () => {
		expect(pipe.transform(-5)).toBe(5);
	});

	it('returns the same value for a positive number', () => {
		expect(pipe.transform(10)).toBe(10);
	});

	it('returns 0 for zero', () => {
		expect(pipe.transform(0)).toBe(0);
	});

	it('returns 0 for null', () => {
		expect(pipe.transform(null)).toBe(0);
	});

	it('returns 0 for undefined', () => {
		expect(pipe.transform(undefined)).toBe(0);
	});
});
