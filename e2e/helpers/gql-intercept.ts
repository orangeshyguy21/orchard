/**
 * Playwright response matchers for GraphQL interception. Every fidelity spec
 * that drives the UI uses these to pick its target query out of the stream
 * of POSTs the client sends to `/api`.
 */

import type {Page, Response} from '@playwright/test';

/** Matches a POST to the GraphQL endpoint whose body mentions `queryName`. */
export function matchGql(queryName: string) {
	return (response: Response): boolean =>
		response.url().endsWith('/api') && (response.request().postData() ?? '').includes(queryName);
}

/** Extract `data.<queryName>` from a Playwright response — throws on GraphQL errors.
 *  Assumes the response field matches the query name (no aliasing). */
export async function gqlData<T = Record<string, unknown>>(response: Response, queryName: string): Promise<T> {
	const body = await response.json();
	if (body.errors?.length) {
		throw new Error(`GraphQL error on ${queryName}: ${body.errors[0].message}`);
	}
	return body.data[queryName] as T;
}

/**
 * Navigate to `route` and return the intercepted response for each query fired
 * on load, in the order the caller listed them. Returns a record keyed by query
 * name so the spec reads left-to-right regardless of wire ordering.
 *
 *   const {bitcoin_blockchain_info, bitcoin_network_info} =
 *       await interceptOnNavigation(page, '/bitcoin', ['bitcoin_blockchain_info', 'bitcoin_network_info']);
 */
export async function interceptOnNavigation<K extends string>(
	page: Page,
	route: string,
	queryNames: readonly K[],
): Promise<Record<K, Response>> {
	const waiters = queryNames.map((name) => page.waitForResponse(matchGql(name)));
	const [, ...responses] = await Promise.all([page.goto(route), ...waiters]);
	return Object.fromEntries(queryNames.map((name, i) => [name, responses[i]])) as Record<K, Response>;
}
