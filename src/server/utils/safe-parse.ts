import {Logger} from '@nestjs/common';

const logger = new Logger('SafeParse');

/**
 * Wraps JSON.parse with a try/catch, returning `fallback` on failure.
 * Logs a warning so corrupt data is visible without crashing the process.
 */
export function safeParse<T>(json: string, fallback: T, label?: string): T {
	try {
		return JSON.parse(json);
	} catch (err) {
		logger.warn(`Malformed JSON${label ? ` in ${label}` : ''}: ${(err as Error).message}`);
		return fallback;
	}
}
