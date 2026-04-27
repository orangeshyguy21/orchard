/* Local Dependencies */
import {DataTruncatePipe} from './data-truncate.pipe';

describe('DataTruncatePipe', () => {
	let pipe: DataTruncatePipe;

	beforeEach(() => {
		pipe = new DataTruncatePipe();
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

	it('returns empty string for non-string input', () => {
		// The runtime guard `typeof value !== 'string'` protects against the
		// pipe being applied to a non-string field; assert via cast since the
		// signature itself is `string | null | undefined`.
		expect(pipe.transform(123 as unknown as string)).toBe('');
	});

	it('returns the input verbatim when length <= max_length', () => {
		expect(pipe.transform('short', 50)).toBe('short');
	});

	it('returns the input verbatim when length equals max_length', () => {
		const exactly_ten = '1234567890';
		expect(pipe.transform(exactly_ten, 10)).toBe(exactly_ten);
	});

	it('truncates with default head/tail parameters', () => {
		const sixty_chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWX';
		// default: max=50, head=20, tail=12 → first 20 + '...' + last 12
		const result = pipe.transform(sixty_chars);
		expect(result).toBe('abcdefghijklmnopqrst...UVWXYZ?'.replace('UVWXYZ?', sixty_chars.slice(-12)));
	});

	it('honours custom head/tail counts (60:27:10 — the syncing card hash)', () => {
		const hash = '00000000000000000002155fa7100000000000000000000000000000009024cc85c5';
		const result = pipe.transform(hash, 60, 27, 10);
		expect(result).toBe(`${hash.slice(0, 27)}...${hash.slice(-10)}`);
		// shape sanity
		expect(result.length).toBe(27 + 3 + 10);
	});
});
