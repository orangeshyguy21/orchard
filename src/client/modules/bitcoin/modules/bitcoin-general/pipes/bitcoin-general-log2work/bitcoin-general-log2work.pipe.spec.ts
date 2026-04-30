import {BitcoinGeneralLog2workPipe} from './bitcoin-general-log2work.pipe';

describe('BitcoinGeneralLog2workPipe', () => {
	let pipe: BitcoinGeneralLog2workPipe;

	beforeEach(() => {
		pipe = new BitcoinGeneralLog2workPipe();
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('returns 0 for null', () => {
		expect(pipe.transform(null)).toBe(0);
	});

	it('returns 0 for undefined', () => {
		expect(pipe.transform(undefined)).toBe(0);
	});

	it('returns 0 for empty string', () => {
		expect(pipe.transform('')).toBe(0);
	});

	it('computes log2 of a hex chainwork', () => {
		// chainwork = 0x100 = 256 → log2(256) = 8
		expect(pipe.transform('100')).toBe(8);
	});

	it('rounds to six decimal places', () => {
		const result = pipe.transform('1234567');
		// log2(0x1234567) ≈ 24.18454... → check structure
		expect(result.toString()).toMatch(/^\d+(\.\d{1,6})?$/);
	});

	it('matches Math.log2(parseInt(chainwork, 16)) for a long hex sample', () => {
		// parseInt loses precision past Number.MAX_SAFE_INTEGER (53 bits), so the
		// pipe's log2 is computed on the truncated number — a known limitation
		// callers compensate for by treating the result as approximate.
		const chainwork = '0000000000000000000000000000000000000000000095790731a05cf7d8e8a8';
		const expected = Number(Math.log2(parseInt(chainwork, 16)).toFixed(6));
		expect(pipe.transform(chainwork)).toBe(expected);
	});
});
