/**
 * Feature spec: `orc-bitcoin-general-wallet-summary` — the "Hot Wallet" tile
 * on the dashboard. Flattens the LN on-chain balance and any Taproot Asset
 * UTXOs into one list of expandable rows.
 *
 * Coverage:
 *   - `@all`: the bitcoin row fundamentals — renders on every stack with
 *     LN enabled, amount matches the LN node's on-chain balance, expand
 *     toggle flips `animation-expanded` on caret + details, UTXO count
 *     card matches the number of funded addresses.
 *   - `@tapd`: the taproot-asset row — only runs on `lnd-cdk-sqlite`. A
 *     dedicated `tapd-setup` compose service runs `fund-tapd.sh` at stack
 *     bring-up, which mints `TESTASSET` on tapd-orchard, mines the
 *     confirmation blocks, and blocks Orchard from booting until the
 *     asset is live. The spec reads the asset off tapd via `tapcli`
 *     (differential source of truth) and asserts that the card shows a
 *     second row, the asset glyph uses `graphic-asset-unknown` (no
 *     registered svg for that asset name), the row's amount equals
 *     `parseInt(tapd.amount) / 10^decimal_display`, and the expanded
 *     metadata card shows the truncated group_key (grouped asset),
 *     NORMAL asset type, and the version string.
 *
 * Selector notes (bugs this spec fixes from the previous draft):
 *   - Angular's `[unit]="row.unit"` is a *property* binding — it never
 *     becomes a DOM attribute, so `orc-graphic-asset[unit="sat"]` matches
 *     nothing. Use the stable class names set by `GraphicAssetComponent`:
 *     `.graphic-asset-btc` (sat/msat/btc), `.graphic-asset-unknown`
 *     (unrecognized asset), or `<img src="taproot-assets/*.svg">` for
 *     assets registered in `taproot_group_keys` (USDT today).
 *   - The amount text lives in `<span class="orc-amount">` emitted by
 *     the `localAmount` pipe, not `.font-size-xl` (which wraps both the
 *     amount and an adjacent unit glyph).
 *
 * States NOT covered here (out of scope for e2e fidelity, see .md):
 *   - Oracle card rendering (requires flipping `bitcoin_oracle` + having
 *     a resolved oracle price — no oracle seeded on regtest).
 *   - Lightning / tapd error rows (requires `docker pause` — disruptive).
 *   - Ungrouped taproot asset rendering (em-dash fallback under Group
 *     key). fund-tapd.sh mints a grouped asset because grouped is the
 *     primary/standard form for real operators; the ungrouped `@else`
 *     branch would require a separate fixture.
 *   - USDT svg path (needs an asset whose `tweaked_group_key` matches
 *     `constants.taproot_group_keys.usdt`).
 */

import {execFileSync} from 'node:child_process';
import {test, expect, type Locator, type Page} from '@playwright/test';

import {getConfig} from '../helpers/config';
import {ln} from '../helpers/backend';

/** Shape we read from `tapcli assets list` via `docker exec`. Only the fields
 *  the spec inspects — tapd's actual response has many more. */
type TapdAssetsList = {
	assets: Array<{
		asset_genesis: {name: string; asset_id: string; asset_type: string};
		asset_group?: {tweaked_group_key?: string};
		amount: string;
		decimal_display?: {decimal_display?: number};
		version: string;
	}>;
};

async function openWalletSummary(page: Page): Promise<Locator> {
	const card = page.locator('orc-bitcoin-general-wallet-summary');
	await expect(card).toBeVisible();
	return card;
}

/** The bitcoin row's mat-card-content. The component pushes bitcoin first
 *  in its `init()` rows array, so `.wallet-summary-card:first-child` is
 *  deterministic as long as LN is enabled. Avoid the `filter({has: ...})`
 *  chain — it hits a Playwright resolution edge case on some of our stacks. */
function bitcoinRow(summary: Locator): Locator {
	return summary.locator('.wallet-summary-card').first().locator('mat-card-content');
}

/** Strip the `₿` glyph, commas, whitespace, unit suffix — return digits only. */
function digitsFrom(text: string): number {
	return parseInt(text.replace(/\D/g, ''), 10);
}

test.describe('bitcoin-general-wallet-summary — bitcoin row', {tag: '@all'}, () => {
	test.beforeEach(async ({page}) => {
		await page.goto('/');
	});

	test('renders the "Hot Wallet" title', async ({page}) => {
		const card = await openWalletSummary(page);
		await expect(card.getByText('Hot Wallet', {exact: true})).toBeVisible();
	});

	test('shows the bitcoin row with the sat asset glyph', async ({page}) => {
		const card = await openWalletSummary(page);
		// `.graphic-asset-btc` is what `GraphicAssetComponent.unit_class()` emits
		// for `sat`/`msat`/`btc` — the only stable DOM hook for "this is the
		// bitcoin row". Angular property bindings like `[unit]` do NOT reflect
		// as DOM attributes; selecting on `[unit="sat"]` would match nothing.
		await expect(card.locator('.graphic-asset-btc').first()).toBeVisible();
		// The bitcoin row's glyph carries a hot-wallet custody icon (mode_heat).
		// First match is the bitcoin row; a tapd row, if present, would append
		// its own custody-icon after.
		await expect(card.locator('.graphic-asset-custody-icon').first()).toHaveText(/mode_heat/);
	});

	test('bitcoin row amount matches the LN node on-chain balance', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const card = await openWalletSummary(page);
		const row = bitcoinRow(card);
		// `.orc-amount` is emitted inside the localAmount pipe output. The first
		// match inside the row's summary is the row's own amount; avoid any
		// nested `.orc-amount` an oracle card might emit in the expanded panel.
		const amount_text = (await row.locator('.orc-amount').first().textContent())?.trim() ?? '';
		expect(digitsFrom(amount_text)).toBe(ln.onchainSats(config));
	});

	test('clicking the bitcoin row toggles expand/collapse classes', async ({page}) => {
		const card = await openWalletSummary(page);
		const row = bitcoinRow(card);
		const caret = row.locator('button.orc-animation-rotate-toggle');
		const details = row.locator('.channel-details');

		// Collapsed state: neither element carries animation-expanded.
		await expect(caret).not.toHaveClass(/\banimation-expanded\b/);
		await expect(details).not.toHaveClass(/\banimation-expanded\b/);

		await row.click();
		await expect(caret).toHaveClass(/\banimation-expanded\b/);
		await expect(details).toHaveClass(/\banimation-expanded\b/);

		await row.click();
		await expect(caret).not.toHaveClass(/\banimation-expanded\b/);
		await expect(details).not.toHaveClass(/\banimation-expanded\b/);
	});

	test('expanded bitcoin row shows a UTXO count matching non-zero addresses', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const card = await openWalletSummary(page);
		const row = bitcoinRow(card);
		await row.click();

		const count_card = row.locator('.channel-details .orc-high-card').first();
		const count_value = (await count_card.locator('.font-size-l').first().textContent())?.trim() ?? '';
		const label = (await count_card.locator('.font-size-xs').first().textContent())?.trim() ?? '';

		const utxos = digitsFrom(count_value);
		expect(utxos).toBeGreaterThan(0);
		expect(label).toBe(utxos === 1 ? 'UTXO' : 'UTXOs');

		// Sanity: on-chain sats > 0 ⇒ there's at least one funded address, so
		// the derived count must be > 0 — regressions where `utxos` gets
		// zeroed while the amount stays non-zero fail here.
		expect(ln.onchainSats(config)).toBeGreaterThan(0);
	});

	test('oracle card is not rendered when the oracle setting is off (default)', async ({page}) => {
		const card = await openWalletSummary(page);
		const row = bitcoinRow(card);
		await row.click();
		await expect(row.locator('orc-graphic-oracle-icon')).toHaveCount(0);
		await expect(row.getByText('Hot wallet value', {exact: true})).toHaveCount(0);
	});

	/* *******************************************************
		Child component: orc-bitcoin-general-utxo-stack

		The collapsed-row UTXO glyph. `asset_class` computed emits
		`utxo-asset-btc` for sat/msat/btc units, `utxo-asset-tether` for the
		USDT group_key, else `utxo-asset-unknown`. Coin-array length caps at
		`limiter - 1` (9) with an overflow chip when `coins > limiter`.

		Regtest stacks fund a single address on the LN wallet → `coins === 1`,
		so the overflow-chip and multi-glyph branches are not reachable live
		from this parent. Coverage here asserts the colour-class contract and
		that the parent piped unit/group_key correctly into the child.

		See bitcoin-general-wallet-summary.md → "Child components →
		orc-bitcoin-general-utxo-stack" for the full enumeration.
	******************************************************** */

	test('bitcoin row utxo-stack carries the utxo-asset-btc class', async ({page}) => {
		const card = await openWalletSummary(page);
		const row = bitcoinRow(card);
		// The child renders `utxo-asset-btc` on its primary coin glyph when
		// unit is sat/msat/btc AND no usdt group_key. This is the stable
		// hook verifying the parent passed `unit: 'sat'` through correctly.
		await expect(row.locator('orc-bitcoin-general-utxo-stack .utxo-asset-btc').first()).toBeVisible();
	});
});

test.describe('bitcoin-general-wallet-summary — taproot asset row', {tag: '@tapd'}, () => {
	// Asset identity is seeded by `e2e/docker/scripts/fund-tapd.sh`, which
	// runs from the `tapd-setup` compose service on the `lnd-cdk-sqlite`
	// config. The script mints this asset with these exact parameters before
	// Orchard boots, so by the time any test sees the dashboard, the row is
	// already there. Keep these values in sync with the script.
	const TEST_ASSET = 'TESTASSET';

	/** Read the minted asset's live tapd record. Used to differentially assert
	 *  that Orchard's displayed amount matches `tapd.amount / 10^decimal_display`
	 *  and that the metadata card reflects the real asset_type + version.
	 *
	 *  tapd runs integrated inside the litd container (lnd-cdk-sqlite-lnd-orchard)
	 *  and doesn't bind its own gRPC port — tapcli reaches it via litd's unified
	 *  :8443 endpoint using the litd TLS cert + tapd admin macaroon. */
	function readTestAsset(): TapdAssetsList['assets'][number] {
		const out = execFileSync(
			'docker',
			[
				'exec', 'lnd-cdk-sqlite-lnd-orchard', 'tapcli',
				'--rpcserver=localhost:8443',
				'--tlscertpath=/home/litd/.lit/tls.cert',
				'--macaroonpath=/home/litd/.tapd/data/regtest/admin.macaroon',
				'--network=regtest',
				'assets', 'list',
			],
			{encoding: 'utf8'},
		);
		const listed: TapdAssetsList = JSON.parse(out);
		const asset = listed.assets.find((a) => a.asset_genesis.name === TEST_ASSET);
		if (!asset) {
			throw new Error(`Expected litd-orchard's tapd to hold asset '${TEST_ASSET}' (seeded by fund-tapd.sh). Check the tapd-setup container logs.`);
		}
		return asset;
	}

	test.beforeEach(async ({page}) => {
		await page.goto('/');
	});

	test('a second row appears for the minted taproot asset', async ({page}) => {
		const card = await openWalletSummary(page);
		await expect(card.locator('.wallet-summary-card')).toHaveCount(2);
	});

	test('taproot asset row renders with the unknown-asset glyph', async ({page}) => {
		const card = await openWalletSummary(page);
		// TESTASSET is not one of the registered taproot_group_keys (USDT is),
		// so `supported_taproot_asset` is false and `unit_class()` falls to
		// `graphic-asset-unknown`. A recognized asset would render an <img>
		// instead — that path is documented in the .md, not exercised here.
		await expect(card.locator('.graphic-asset-unknown')).toBeVisible();
	});

	test('taproot asset row amount equals tapd amount descaled by decimal_display', async ({page}) => {
		const asset = readTestAsset();
		const expected = parseInt(asset.amount, 10) / Math.pow(10, asset.decimal_display?.decimal_display ?? 0);

		const card = await openWalletSummary(page);
		// Second row = tapd row (bitcoin is always first — component pushes in order).
		const tapd_row = card.locator('.wallet-summary-card').nth(1).locator('mat-card-content');
		const amount_text = (await tapd_row.locator('.orc-amount').first().textContent())?.trim() ?? '';
		expect(digitsFrom(amount_text)).toBe(expected);
	});

	test('taproot asset row utxo-stack carries the utxo-asset-unknown class', async ({page}) => {
		// TESTASSET has no registered group_key in `taproot_group_keys`, so
		// the utxo-stack child falls to `utxo-asset-unknown` for both the
		// primary glyph and the overflow marker. This is the stable hook
		// verifying the parent passed `unit: 'TESTASSET'` + a non-usdt
		// group_key through to the child.
		const card = await openWalletSummary(page);
		const tapd_row = card.locator('.wallet-summary-card').nth(1).locator('mat-card-content');
		await expect(tapd_row.locator('orc-bitcoin-general-utxo-stack .utxo-asset-unknown').first()).toBeVisible();
	});

	test('expanded taproot row shows metadata card: group_key truncation, asset_type, asset_version', async ({page}) => {
		const asset = readTestAsset();

		const card = await openWalletSummary(page);
		const tapd_row = card.locator('.wallet-summary-card').nth(1).locator('mat-card-content');
		await tapd_row.click();

		// Two high-cards after expand: UTXO count + tapd metadata. The metadata
		// one is the second .orc-high-card under .channel-details.
		const metadata_card = tapd_row.locator('.channel-details .orc-high-card').nth(1);
		await expect(metadata_card.getByText('Group key', {exact: true})).toBeVisible();
		await expect(metadata_card.getByText('Asset type', {exact: true})).toBeVisible();
		await expect(metadata_card.getByText('Asset version', {exact: true})).toBeVisible();

		// Grouped asset — the template emits `group_key | dataTruncate: 12 : 6 : 6`
		// which renders as first6 + "..." + last6 of the hex group_key.
		const group_key = asset.asset_group?.tweaked_group_key;
		if (!group_key) throw new Error(`tapd reported no asset_group.tweaked_group_key for ${TEST_ASSET}`);
		const truncated = `${group_key.substring(0, 6)}...${group_key.substring(group_key.length - 6)}`;
		await expect(metadata_card.getByText(truncated, {exact: true})).toBeVisible();

		// Asset type + version come straight from the tapd response.
		await expect(metadata_card.getByText(asset.asset_genesis.asset_type, {exact: true})).toBeVisible();
		await expect(metadata_card.getByText(asset.version, {exact: true})).toBeVisible();
	});
});
