/**
 * Feature spec: `orc-lightning-general-info` — the "Info" card that surfaces
 * LN node state on the dashboard index page (Lightning row).
 *
 * Covers the states reachable from a healthy regtest fixture:
 *   - structure: title, status dot, projected FAB
 *   - node identity: alias, "Mint backend" sub-label
 *   - traffic light: `online` (error=false + synced_to_chain + synced_to_graph)
 *   - counts: peers + open channels — each differentially checked against the
 *     LN backend's own `getinfo` (via lncli / lightning-cli)
 *   - URI block: chip renders when the LN node advertises at least one URI;
 *     skipped when the node returns an empty uris[]
 *   - interaction: projected "Open Lightning" FAB navigates to /lightning
 *
 * States the component supports but this spec does NOT cover:
 *   - `offline` (requires `docker pause <ln-container>`, disruptive to siblings)
 *   - `syncing` (can't be synthesized on regtest without a synthetic stall)
 *   - URI chip click → `NetworkConnectionComponent` dialog (QR render is async
 *     and the image rasterisation is timing-sensitive)
 *   - empty-URIs branch (LND/CLN always emit at least one address on regtest)
 *   - `backend === false` (every e2e config feeds its mint off this LN node)
 * See `lightning-general-info.md` for the full state machine.
 */

import {test, expect, type Locator, type Page} from '@playwright/test';

import {getConfig} from '../helpers/config';
import {ln} from '../helpers/backend';

/** Raw getinfo shape — we only read fields that LND and CLN both emit under
 *  the same name. Both backends expose these exact keys on regtest. */
type LnGetInfo = {
	alias: string;
	num_peers: number;
	num_active_channels: number;
	num_inactive_channels: number;
	uris?: string[];
};

/** Read the numeric/text value displayed under a metric label in the card.
 *  Mirrors the helper in bitcoin-general-info.spec.ts — the label->value
 *  DOM pattern is shared between the two info cards. */
async function metricValue(card: Locator, label: string): Promise<string> {
	const wrapper = card.getByText(label, {exact: true}).locator('..');
	return (await wrapper.locator('.font-size-l').first().textContent())?.trim() ?? '';
}

async function openInfoCard(page: Page): Promise<Locator> {
	const card = page.locator('orc-lightning-general-info');
	await expect(card).toBeVisible();
	return card;
}

/** Strip everything except digits. Handles "2", "12 Peers", etc. */
function digitsFrom(text: string): number {
	return parseInt(text.replace(/\D/g, ''), 10);
}

test.describe('lightning-general-info card', {tag: '@all'}, () => {
	test.beforeEach(async ({page}) => {
		await page.goto('/');
	});

	test('renders the info card with a title', async ({page}) => {
		const card = await openInfoCard(page);
		await expect(card.getByText('Info', {exact: true})).toBeVisible();
	});

	test('displays the alias reported by the LN node', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const card = await openInfoCard(page);
		const alias = (ln.getInfo(config) as LnGetInfo).alias ?? '';
		await expect(card.getByText(alias, {exact: true})).toBeVisible();
	});

	test('shows the "Mint backend" sub-label because this LN node feeds the Cashu mint', async ({page}) => {
		// All four e2e configs wire their Cashu mint (nutshell or cdk) to this
		// same stack's LN node, so the server's `lightning_info.backend` check
		// resolves true. If this ever flips, the sub-label disappears — catching
		// a regression in the detection.
		const card = await openInfoCard(page);
		await expect(card.getByText('Mint backend', {exact: true})).toBeVisible();
	});

	test('renders the "online" state dot and label when the LN node is healthy', async ({page}) => {
		const card = await openInfoCard(page);
		await expect(card.locator('orc-graphic-status')).toBeVisible();
		await expect(card.getByText('online', {exact: true})).toBeVisible();
	});

	test('displays the peer count reported by the LN node', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const card = await openInfoCard(page);
		const displayed = await metricValue(card, 'Peers');
		const info = ln.getInfo(config) as LnGetInfo;
		expect(digitsFrom(displayed) || 0).toBe(info.num_peers);
	});

	test('displays the open channel count from num_active + num_inactive', async ({page}, testInfo) => {
		// `open_channels` on the component is `num_active + num_inactive` — it
		// deliberately excludes `num_pending_channels`. Regtest opens only
		// confirmed channels via fund-lnd.sh, so pending is 0 and the simple
		// sum matches the UI.
		const config = getConfig(testInfo.project.name);
		const card = await openInfoCard(page);
		const displayed = await metricValue(card, 'Channels');
		const info = ln.getInfo(config) as LnGetInfo;
		const expected = (info.num_active_channels ?? 0) + (info.num_inactive_channels ?? 0);
		expect(digitsFrom(displayed) || 0).toBe(expected);
	});

	test('renders a URI chip when the LN node advertises at least one URI', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = ln.getInfo(config) as LnGetInfo;
		// LND's `getinfo` exposes uris[] directly. CLN returns `address[]`
		// separately and Orchard's server builds uris from id@address:port —
		// `getinfo` alone won't tell us that story, so on CLN stacks we skip
		// rather than false-fail.
		test.skip(config.ln === 'cln', 'CLN getinfo does not expose a pre-formatted uris[] — server-built, not differentially assertable from cli alone');
		test.skip(!info.uris || info.uris.length === 0, 'LN node advertises no URIs — chip rendering path, nothing to assert');

		const card = await openInfoCard(page);
		// One chip per URI. Prefix of the displayed label is the first 11 chars
		// of the pubkey (from `transformUri()` in the component). The live URI
		// on regtest is `{orchard_pubkey}@172.26.0.4:9735` — private IP, so the
		// status icon is inactive (red), but the chip itself always renders.
		await expect(card.locator('mat-chip')).toHaveCount(info.uris!.length);
	});

	test('projects the "Open Lightning" FAB into the card footer', async ({page}) => {
		const card = await openInfoCard(page);
		await expect(card.getByRole('button', {name: /open lightning/i})).toBeVisible();
	});

	test('Open Lightning FAB navigates to /lightning', async ({page}) => {
		// Unlike the Bitcoin card (which opens a mat-menu of sub-routes), this
		// FAB carries `[routerLink]="['/lightning']"` directly — a single click
		// is sufficient to land on the lightning section.
		const card = await openInfoCard(page);
		await card.getByRole('button', {name: /open lightning/i}).click();
		await expect(page).toHaveURL(/\/lightning$/);
	});
});
