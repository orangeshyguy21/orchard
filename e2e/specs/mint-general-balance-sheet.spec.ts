/**
 * Feature spec: `orc-mint-general-balance-sheet` — the "Balance Sheet" card
 * on the dashboard (`/`) summarising assets vs. liabilities for each Cashu
 * mint unit. Same component is reused on `/mint`; the dashboard tile is
 * the canonical surface every spec navigates to in `beforeEach`.
 *
 * Coverage by tag (project grep wires each describe to the right stacks):
 *   - `@mint`: structure that holds on every stack — title, one card per
 *     provisioned mint unit (driven by `mintUnitsFor(config)`), the row's
 *     "Unspent ecash" liabilities sublabel, the click-to-expand toggle, and
 *     the always-present Mint unit high-card inside the expanded panel.
 *   - `@lightning`: the bitcoin-row branch — Lightning local capacity
 *     sublabel, the desktop-only visual stacks, the inline keyset chip
 *     in `.toggle-cell`, three high-cards in the expanded panel, and the
 *     no-oracle default (only checked when `appSettings.bitcoin_oracle`
 *     is unset for this stack).
 *   - `@no-lightning`: only fake-cdk-postgres — every row's Assets cell
 *     collapses to a "Lightning Configuration" button, and clicking it
 *     navigates to /lightning via the parent's `(navigate)` handler.
 *   - `@oracle`: only cln-nutshell-postgres — the expanded bitcoin row
 *     surfaces the `.orc-primary-card` Oracle subcard with header text.
 *   - Multi-unit fiat rows are exercised opportunistically — tests that
 *     read the USD or EUR row `test.skip` when `mintUnitsFor(config)`
 *     doesn't include them.
 *
 * States the component supports but this spec does NOT cover:
 *   - lightning_loading transient (race-prone — better in Karma)
 *   - lightning_errors render path (requires `docker pause` — disruptive)
 *   - empty-keysets state (both mint daemons auto-provision a sat keyset)
 *   - reserve `< 1` insolvent state (regtest fund-topology never sets up)
 *   - amount-fidelity differential against the LN node's channel local
 *     balance (`ln.localChannelBalance(config)` helper not in
 *     e2e/helpers/backend.ts yet — see mint-general-balance-sheet.md
 *     "Differential oracles" for the gap).
 * See `mint-general-balance-sheet.md` for the full state machine.
 */

import {test, expect, type Locator, type Page} from '@playwright/test';

import {getConfig, mintUnitsFor} from '../helpers/config';
import {oracleHasRecentData, requireReady} from '../helpers/readiness';

async function openSheet(page: Page): Promise<Locator> {
	// Both `/` (dashboard tile) and `/mint` (subsection dashboard) host one
	// instance — `.first()` is defensive for future surfaces that mount it
	// elsewhere on the same page.
	const sheet = page.locator('orc-mint-general-balance-sheet').first();
	await expect(sheet).toBeVisible();
	return sheet;
}

/** Wait for the row block to settle. The component sets `rows()` inside an
 *  `ngOnChanges` reaction to `loading=false` / `lightning_balance` / oracle
 *  price; the parent dashboard tile is wrapped in `@if (!loading())` so the
 *  card may mount before its rows are rendered. Card existence ⇒ wait for
 *  at least one `.balance-sheet-card` for stacks that have keysets.
 *
 *  Timeout bumped to 20s — under parallel-stack contention (5 stacks
 *  share one Playwright worker pool) the slower stacks can take well over
 *  the default 5s `expect` window for the dashboard's mint queries to
 *  resolve and the parent's `loading()` to flip false. */
async function waitForRows(sheet: Locator): Promise<void> {
	await expect(sheet.locator('.balance-sheet-card').first()).toBeVisible({timeout: 20_000});
}

/** Wait for the bitcoin row's assets cell to *settle*. The cell goes through
 *  three states: empty (lightning_loading=true), amount-rendered (assets
 *  populated from `lightning_balance.open.local_balance`), or stuck-null
 *  (lightning_balance arrived after the first init() and a re-init never
 *  fired). The `lightningBalance` query is part of a forkJoin with four
 *  other LN queries in `index-subsection-dashboard.component.ts:320` — on
 *  cln-* stacks (mainchain overlay, slow `listpeerchannels`) and under
 *  parallel-stack load this can take ~10–15s. Wait up to 25s for the
 *  amount text inside `.orc-amount`. */
async function waitForBitcoinAssetsSettled(row: Locator): Promise<void> {
	await expect(row.locator('.assets-cell .orc-amount').first()).toBeVisible({timeout: 25_000});
}

/** Bitcoin row sorts first via `currency_order` (sat=2, msat=3, usd=4, eur=5).
 *  Both nutshell and cdk default to `sat`, so this is deterministic on every
 *  current stack. */
function bitcoinRow(sheet: Locator): Locator {
	return sheet.locator('.balance-sheet-card').first();
}

/** Find a row by its keyset chip's `unit | localUnit` rendered text. The
 *  chip lives inside `.toggle-cell` on desktop and inside
 *  `.balance-sheet-details` on tablet/mobile; either way it's scoped to the
 *  correct row's `.balance-sheet-card`. */
function rowByUnit(sheet: Locator, unit: 'sat' | 'usd' | 'eur'): Locator {
	const upper = unit.toUpperCase();
	return sheet.locator('.balance-sheet-card').filter({
		has: sheet.page().locator(`.orc-high-card`, {hasText: new RegExp(`^${upper}\\s*Mint unit`, 'i')}),
	});
}

test.describe('mint-general-balance-sheet — card', {tag: '@mint'}, () => {
	test.beforeEach(async ({page}) => {
		await page.goto('/');
	});

	test('renders the "Balance Sheet" title', async ({page}) => {
		const sheet = await openSheet(page);
		await expect(sheet.getByText('Balance Sheet', {exact: true})).toBeVisible();
	});

	test('renders one row per provisioned mint unit', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const expected_units = mintUnitsFor(config).length;
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		await expect(sheet.locator('.balance-sheet-card')).toHaveCount(expected_units);
	});

	test('every row shows the "Unspent ecash" liabilities sublabel', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const expected_units = mintUnitsFor(config).length;
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const sublabels = sheet.locator('.liabilities-cell').getByText('Unspent ecash', {exact: false});
		// The phrase appears as part of "Liabilities  ●  Unspent ecash". One per row.
		await expect(sublabels).toHaveCount(expected_units);
	});

	test('clicking a row toggles the .animation-expanded class on .balance-sheet-details', async ({page}) => {
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const row = bitcoinRow(sheet);
		const details = row.locator('.balance-sheet-details');
		const click_target = row.locator('.balance-sheet-row');

		await expect(details).not.toHaveClass(/\banimation-expanded\b/);

		await click_target.click();
		await expect(details).toHaveClass(/\banimation-expanded\b/);

		await click_target.click();
		await expect(details).not.toHaveClass(/\banimation-expanded\b/);
	});

	test('expanded row shows the "Mint unit" high-card', async ({page}) => {
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const row = bitcoinRow(sheet);
		await row.locator('.balance-sheet-row').click();
		const details = row.locator('.balance-sheet-details');
		await expect(details).toHaveClass(/\banimation-expanded\b/);
		await expect(details.getByText('Mint unit', {exact: true})).toBeVisible();
	});
});

test.describe('mint-general-balance-sheet — bitcoin row', {tag: '@lightning'}, () => {
	test.beforeEach(async ({page}) => {
		await page.goto('/');
	});

	test('shows the "Lightning local capacity" sublabel in the assets cell', async ({page}) => {
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const row = bitcoinRow(sheet);
		await waitForBitcoinAssetsSettled(row);
		await expect(row.locator('.assets-cell').getByText('Lightning local capacity', {exact: false})).toBeVisible();
	});

	test('shows a non-zero amount in the assets cell', async ({page}) => {
		// `lightning_balance.open.local_balance` from the lightningBalance query.
		// A backend differential against `lncli channelbalance` belongs here once
		// `ln.localChannelBalance(config)` exists in `e2e/helpers/backend.ts`
		// (flagged in mint-general-balance-sheet.md → Differential oracles).
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const row = bitcoinRow(sheet);
		await waitForBitcoinAssetsSettled(row);
		const amount_text = (await row.locator('.assets-cell .orc-amount').first().textContent())?.trim() ?? '';
		const digits = parseInt(amount_text.replace(/\D/g, ''), 10);
		expect(digits).toBeGreaterThan(0);
	});

	test('renders the visual coin stacks on desktop', async ({page}) => {
		// The Visual cell is gated on `device_type === 'desktop' && row.assets !== null`.
		// Default Playwright viewport is desktop. Wait for assets to settle so the
		// `assets !== null` branch holds when the assertion runs.
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const row = bitcoinRow(sheet);
		await waitForBitcoinAssetsSettled(row);
		await expect(row.locator('orc-mint-general-balance-stacks')).toBeVisible();
	});

	test('inline keyset chip lives inside .toggle-cell on desktop', async ({page}) => {
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const row = bitcoinRow(sheet);
		await expect(row.locator('.toggle-cell orc-mint-general-keyset')).toBeVisible();
		await expect(row.locator('.toggle-cell').getByText('Active keyset', {exact: true})).toBeVisible();
	});

	test('expanded row shows three high-cards: Mint unit, Liability coverage, Fee revenue', async ({page}) => {
		// `Liability coverage` only renders when `row.assets !== null`. Bitcoin
		// rows always carry assets when LN is enabled — the parent feeds
		// `lightning_balance.open.local_balance`. Wait for assets to settle
		// before clicking, so the row's expanded panel fills in with all three
		// cards (the `assets !== null` gate is read at render time).
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const row = bitcoinRow(sheet);
		await waitForBitcoinAssetsSettled(row);
		await row.locator('.balance-sheet-row').click();
		const details = row.locator('.balance-sheet-details');
		await expect(details).toHaveClass(/\banimation-expanded\b/);
		const high_cards = details.locator('.orc-high-card');
		await expect(high_cards).toHaveCount(3);
		// Scope text checks to the high-card region. On `@oracle` stacks the
		// expanded panel also renders an `.orc-primary-card` Oracle subcard
		// whose per-figure sublabels include their own "Fee revenue" string —
		// without this scope the bare `getByText('Fee revenue')` resolves to
		// two elements and trips strict mode.
		await expect(high_cards.getByText('Mint unit', {exact: true})).toBeVisible();
		await expect(high_cards.getByText('Liability coverage', {exact: true})).toBeVisible();
		await expect(high_cards.getByText('Fee revenue', {exact: true})).toBeVisible();
	});

	test('expanded row hides the Oracle subcard when the oracle setting is off', async ({page}, testInfo) => {
		// Skip on stacks where the settings setup phase turned the oracle on —
		// the off-default branch is unreachable there, covered by the @oracle
		// describe block below.
		const config = getConfig(testInfo.project.name);
		test.skip(config.appSettings?.bitcoin_oracle === true, 'oracle is on for this stack — see @oracle describe');
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const row = bitcoinRow(sheet);
		await waitForBitcoinAssetsSettled(row);
		await row.locator('.balance-sheet-row').click();
		const details = row.locator('.balance-sheet-details');
		await expect(details).toHaveClass(/\banimation-expanded\b/);
		await expect(details.locator('.orc-primary-card')).toHaveCount(0);
	});
});

test.describe('mint-general-balance-sheet — fiat rows', {tag: '@mint'}, () => {
	test.beforeEach(async ({page}) => {
		await page.goto('/');
	});

	test('USD row asset cell renders the placeholder dash (LN) or the Lightning Configuration button (no-LN)', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const units = mintUnitsFor(config);
		test.skip(!units.includes('usd'), 'this stack does not provision a USD keyset');
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		// `getRows` sorts btc/sat → usd → eur. With only sat+usd, USD is the
		// second card; with sat+usd+eur, USD is also second.
		const sat_index = units.indexOf('sat');
		const usd_index = units.indexOf('usd');
		const card_index = sat_index < usd_index ? usd_index - sat_index : usd_index;
		const row = sheet.locator('.balance-sheet-card').nth(card_index);
		if (config.ln === false) {
			// On no-LN stacks the assets cell collapses to the Lightning Configuration
			// button for every row regardless of unit (template's @else branch on
			// `lightning_enabled()`).
			await expect(row.locator('.assets-cell button[mat-stroked-button]')).toHaveText('Lightning Configuration');
		} else {
			// `<mat-icon>check_indeterminate_small</mat-icon>` keeps the ligature
			// name in textContent. Filter mat-icons by that text — `orc-graphic-asset`
			// inside the same cell renders other mat-icons (currency_bitcoin, bolt)
			// that we want to ignore.
			await expect(row.locator('.assets-cell mat-icon').filter({hasText: 'check_indeterminate_small'})).toBeVisible();
			await expect(row.locator('.assets-cell .orc-amount')).toHaveCount(0);
		}
	});

	test('EUR row asset cell renders the placeholder dash (LN) or the Lightning Configuration button (no-LN)', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const units = mintUnitsFor(config);
		test.skip(!units.includes('eur'), 'this stack does not provision a EUR keyset');
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const eur_index = units.indexOf('eur');
		const sat_index = units.indexOf('sat');
		const card_index = sat_index < eur_index ? eur_index - sat_index : eur_index;
		const row = sheet.locator('.balance-sheet-card').nth(card_index);
		if (config.ln === false) {
			await expect(row.locator('.assets-cell button[mat-stroked-button]')).toHaveText('Lightning Configuration');
		} else {
			await expect(row.locator('.assets-cell mat-icon').filter({hasText: 'check_indeterminate_small'})).toBeVisible();
		}
	});

	test('expanded fiat row omits the "Liability coverage" card', async ({page}, testInfo) => {
		// Fiat rows have `row.assets === null`, which gates out the Liability
		// coverage high-card. Mint unit + Fee revenue still render.
		const config = getConfig(testInfo.project.name);
		const units = mintUnitsFor(config);
		test.skip(!units.includes('usd') && !units.includes('eur'), 'this stack has no fiat keyset');
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const fiat_unit = units.includes('usd') ? 'usd' : 'eur';
		const sat_index = units.indexOf('sat');
		const fiat_index = units.indexOf(fiat_unit);
		const card_index = sat_index < fiat_index ? fiat_index - sat_index : fiat_index;
		const row = sheet.locator('.balance-sheet-card').nth(card_index);
		await row.locator('.balance-sheet-row').click();
		const details = row.locator('.balance-sheet-details');
		await expect(details).toHaveClass(/\banimation-expanded\b/);
		await expect(details.locator('.orc-high-card')).toHaveCount(2);
		await expect(details.getByText('Liability coverage', {exact: true})).toHaveCount(0);
	});
});

test.describe('mint-general-balance-sheet — lightning disabled', {tag: '@no-lightning'}, () => {
	test.beforeEach(async ({page}) => {
		await page.goto('/');
	});

	test('renders the "Lightning Configuration" button per row in place of the assets value', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const expected_units = mintUnitsFor(config).length;
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const buttons = sheet.locator('.assets-cell button[mat-stroked-button]');
		await expect(buttons).toHaveCount(expected_units);
		await expect(buttons.first()).toHaveText('Lightning Configuration');
	});

	test('clicking the Lightning Configuration button navigates to /lightning', async ({page}) => {
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		await sheet.locator('.assets-cell button[mat-stroked-button]').first().click();
		await expect(page).toHaveURL(/\/lightning(\/|$)/);
	});
});

test.describe('mint-general-balance-sheet — oracle subcard', {tag: '@oracle'}, () => {
	test.beforeEach(async ({page}) => {
		await page.goto('/');
		await requireReady(page, oracleHasRecentData);
	});

	test('expanded bitcoin row surfaces the Oracle subcard', async ({page}) => {
		// Only runs on cln-nutshell-postgres — `appSettings.bitcoin_oracle: true`
		// + the `compose.mainchain.yml` overlay together let Orchard resolve a
		// real oracle price (staged by `oracle.setup.ts`).
		const sheet = await openSheet(page);
		await waitForRows(sheet);
		const row = bitcoinRow(sheet);
		await row.locator('.balance-sheet-row').click();
		const details = row.locator('.balance-sheet-details');
		await expect(details).toHaveClass(/\banimation-expanded\b/);
		const oracle_card = details.locator('.orc-primary-card');
		await expect(oracle_card).toBeVisible();
		await expect(oracle_card.getByText('Oracle', {exact: true})).toBeVisible();
	});
});
