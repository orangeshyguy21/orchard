/**
 * Playwright response matchers for GraphQL interception. Every fidelity spec
 * that drives the UI uses these to pick target queries out of the stream
 * of POSTs the client sends to `/api`.
 */

import type {Page, Response} from '@playwright/test';

/** Matches a POST to the GraphQL endpoint whose body mentions `queryName`. */
export function matchGql(queryName: string) {
	return (response: Response): boolean =>
		response.url().endsWith('/api') && (response.request().postData() ?? '').includes(queryName);
}

/**
 * Navigate to `route` and return the parsed `data.<queryName>` payload for
 * each query fired on load, keyed by query name.
 *
 * Each body is read *inside* its own waiter — the moment the response
 * resolves — not after Promise.all finishes. Playwright can GC response
 * bodies once the owning navigation settles, and on slow stacks that
 * window is small enough to race a deferred `response.json()` call.
 *
 * Assumes `data.<queryName>` (no GraphQL aliases in the client).
 */
export async function interceptOnNavigation<K extends string>(
	page: Page,
	route: string,
	queryNames: readonly K[],
): Promise<Record<K, Record<string, unknown>>> {
	const waiters = queryNames.map(async (name) => {
		const response = await page.waitForResponse(matchGql(name));
		const body = await response.json();
		if (body.errors?.length) {
			throw new Error(`GraphQL error on ${name}: ${body.errors[0].message}`);
		}
		return [name, body.data[name]] as const;
	});
	const [, ...entries] = await Promise.all([page.goto(route), ...waiters]);
	return Object.fromEntries(entries) as Record<K, Record<string, unknown>>;
}
