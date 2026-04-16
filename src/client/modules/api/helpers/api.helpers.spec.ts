/* Local Dependencies */
import {deriveWsScheme} from './api.helpers';

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
