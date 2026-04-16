/* Local Dependencies */
import {deriveWsScheme, hasGqlWsErrorCode} from './api.helpers';

describe('deriveWsScheme', () => {
	it('returns wss: for https: pages', () => {
		expect(deriveWsScheme('https:')).toBe('wss:');
	});

	it('returns ws: for http: pages', () => {
		expect(deriveWsScheme('http:')).toBe('ws:');
	});

	it('returns ws: for any non-https scheme (avoids accidental upgrade on file:, chrome-extension:, etc.)', () => {
		expect(deriveWsScheme('file:')).toBe('ws:');
		expect(deriveWsScheme('')).toBe('ws:');
	});
});

describe('hasGqlWsErrorCode', () => {
	it('returns true when a GraphQL error in the array carries the matching code', () => {
		expect(hasGqlWsErrorCode([{extensions: {code: 10002}}], 10002)).toBe(true);
	});

	it('returns false when no error in the array carries the code', () => {
		expect(hasGqlWsErrorCode([{extensions: {code: 10005}}], 10002)).toBe(false);
	});

	it('returns false for non-array payloads (CloseEvent, undefined, strings)', () => {
		expect(hasGqlWsErrorCode(new Event('close'), 10002)).toBe(false);
		expect(hasGqlWsErrorCode(undefined, 10002)).toBe(false);
		expect(hasGqlWsErrorCode('error', 10002)).toBe(false);
	});

	it('tolerates entries missing extensions', () => {
		expect(hasGqlWsErrorCode([{}, {extensions: {}}], 10002)).toBe(false);
	});
});
