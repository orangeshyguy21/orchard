/**
 * Backend-state readiness check, composed from the same GraphQL queries the
 * client UI already uses. No bespoke server endpoint — `bitcoin_blockchain_info`
 * tells us if the chain is synced; `bitcoin_oracle` tells us if a price exists
 * for a given day. Both setup phases and specs use these to skip cleanly when
 * a precondition isn't met (e.g. mainchain still in IBD, oracle not yet
 * backfilled), surfacing a structured `e2e-readiness:` skip reason rather
 * than failing or hanging.
 */

import {type Page, test} from '@playwright/test';

export interface BlockchainInfo {
	verificationprogress: number;
	initialblockdownload: boolean;
	blocks: number;
}

export interface OraclePrice {
	date: number;
	price: number;
}

export interface Readiness {
	bitcoin: BlockchainInfo;
	oracle_recent: OraclePrice[];
}

export interface ReadinessPredicate {
	(r: Readiness): {ok: boolean; reason: string};
}

const BITCOIN_BLOCKCHAIN_INFO_QUERY = `{ bitcoin_blockchain_info { verificationprogress initialblockdownload blocks } }`;
const BITCOIN_ORACLE_RECENT_QUERY = `query Recent($start_date: UnixTimestamp, $end_date: UnixTimestamp) {
	bitcoin_oracle(start_date: $start_date, end_date: $end_date) { date price }
}`;

const SECONDS_PER_DAY = 86_400;

/** Orchard puts the JWT in localStorage and the Apollo interceptor injects
 *  it as `Authorization: Bearer <token>` on every request. `page.request`
 *  inherits cookies but not localStorage, so we read the token via the page
 *  context and forward it explicitly — without it, resolvers reject the call
 *  with `AuthenticationError`. */
async function gql(page: Page, query: string, variables?: Record<string, unknown>): Promise<Record<string, unknown>> {
	// LocalStorageService JSON-stringifies on write, so the raw localStorage
	// value has surrounding quotes — parse them off before forwarding.
	const raw = await page.evaluate(() => localStorage.getItem('v0.auth.token'));
	const token = raw ? (JSON.parse(raw) as string) : null;
	const headers: Record<string, string> = {};
	if (token) headers['Authorization'] = `Bearer ${token}`;
	const response = await page.request.post('/api', {headers, data: {query, variables}});
	if (!response.ok()) throw new Error(`GraphQL ${response.status()} on readiness query`);
	const body = await response.json();
	if (body.errors?.length) throw new Error(`GraphQL error: ${body.errors[0].message}`);
	return body.data;
}

/** Compose backend-state queries the UI already uses. Cheap enough to call
 *  per-test; promote to a worker-scoped fixture if it ever shows up in a
 *  trace. */
export async function getReadiness(page: Page): Promise<Readiness> {
	const now_unix = Math.floor(Date.now() / 1000);
	const start = now_unix - 7 * SECONDS_PER_DAY;
	const [bitcoin_data, oracle_data] = await Promise.all([
		gql(page, BITCOIN_BLOCKCHAIN_INFO_QUERY),
		gql(page, BITCOIN_ORACLE_RECENT_QUERY, {start_date: start, end_date: now_unix}),
	]);
	return {
		bitcoin: bitcoin_data.bitcoin_blockchain_info as BlockchainInfo,
		oracle_recent: oracle_data.bitcoin_oracle as OraclePrice[],
	};
}

/** Skip the current test (or setup step) if the predicate fails. The reason
 *  is prefixed `e2e-readiness:` so reporters can group readiness skips
 *  separately from grep-not-applicable ones.
 *
 *  Call AFTER `page.goto(...)` — `localStorage` access on `about:blank`
 *  raises `SecurityError`, so the page must be on an Orchard origin first. */
export async function requireReady(page: Page, predicate: ReadinessPredicate): Promise<void> {
	const readiness = await getReadiness(page);
	const {ok, reason} = predicate(readiness);
	test.skip(!ok, `e2e-readiness: ${reason}`);
}

/** Tip is fresh enough to run oracle backfill — chain not in IBD and headers
 *  caught up. The verificationprogress threshold matches the UI's "Bitcoin
 *  Disabled" gating. */
export const mainchainSynced: ReadinessPredicate = (r) => ({
	ok: !r.bitcoin.initialblockdownload && r.bitcoin.verificationprogress >= 0.99,
	reason: `mainchain_synced ibd=${r.bitcoin.initialblockdownload} progress=${r.bitcoin.verificationprogress.toFixed(4)}`,
});

/** Oracle has at least one recent price (within the last 7 days). Used by
 *  specs that depend on `oracle.setup.ts` having staged data. */
export const oracleHasRecentData: ReadinessPredicate = (r) => ({
	ok: r.oracle_recent.length > 0,
	reason: `oracle_has_recent_data rows=${r.oracle_recent.length}`,
});
