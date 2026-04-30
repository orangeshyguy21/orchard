import {BitcoinGeneralBlockPipe} from './bitcoin-general-block.pipe';

describe('BitcoinGeneralBlockPipe', () => {
	let pipe: BitcoinGeneralBlockPipe;

	beforeEach(() => {
		pipe = new BitcoinGeneralBlockPipe();
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

	it('passes through values under 1000 unchanged', () => {
		expect(pipe.transform(113)).toBe('113');
	});

	it('inserts thin-space group separators every three digits', () => {
		// The regex uses a regular space; assert character-for-character.
		expect(pipe.transform(911863)).toBe('911 863');
		expect(pipe.transform(1000000)).toBe('1 000 000');
	});

	it('accepts string input and groups digits', () => {
		expect(pipe.transform('946819')).toBe('946 819');
	});

	it('strips existing whitespace before regrouping', () => {
		expect(pipe.transform('946 819')).toBe('946 819');
	});
});
