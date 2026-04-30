/**
 * Feature spec: `orc-mint-general-config` — the "Config" card on /mint
 * that surfaces the mint daemon's NUT-06 advertised capabilities (which
 * NUTs it supports, whether minting/melting are enabled, and the
 * min→max range per `(method, unit)` for both directions).
 *
 * Differential against the live mint daemon. Each test reads the mint's
 * own NUT-06 `/v1/info` via the `mint` helper (docker-execs into the
 * mint container) and asserts the rendered card matches that truth —
 * chip set, chip palettes, pill states, limit rows, min/max values.
 *
 * Per-fixture branching. cdk publishes explicit min=1/max=500_000 and
 * `nut19: {…}`; nutshell publishes both bounds as `null` and serves
 * `nut19: null`. The component renders `1` for null mins and `∞` for
 * null maxes, and pushes a `null` `nut19` into the `disabled` palette
 * (grey dot) — both branches asserted below from the helper truth.
 *
 * Covers states reachable from a healthy regtest fixture:
 *   - structure: title, mat-card, supported-nuts caption
 *   - chip set: one chip per `nutN` key in `info.nuts`, in numeric
 *     order with the parsed number rendered, dot palette per
 *     `getNutStatus()`'s rules (active for NUT-04/05 not-disabled,
 *     enabled for any other supported NUT, disabled for `null`)
 *   - status pills: "Minting enabled|disabled" and
 *     "Melting enabled|disabled" reflect `nut4.disabled` / `nut5.disabled`
 *   - limit rows: one row per `nut4.methods[]` / `nut5.methods[]` entry,
 *     each rendering `orc-graphic-asset` for the unit, an
 *     `orc-mint-general-payment-method` badge for the method, and the
 *     min → max numeric range (with `1` / `∞` fallbacks for null)
 *
 * States the component supports but this spec does NOT cover (see
 * `mint-general-config.md` → "Skip taxonomy"):
 *   - `nut4.disabled`/`nut5.disabled` red palettes (no fixture toggles
 *     these — would need a dedicated minting-disabled docker config)
 *   - BOLT 12 method rendering (no fixture publishes `bolt12` in
 *     `nuts.nut4.methods`/`nuts.nut5.methods`; the LN backend on
 *     cln-cdk-postgres speaks bolt12 but its mintd.toml advertises only
 *     `bolt11` to the cashu API)
 *   - multi-method bar-width scaling with the 5% floor (only one row
 *     per direction on every fixture; covered in unit tests instead)
 *   - mixed-units rendering (sat + usd) — only fake-cdk-postgres
 *     advertises usd and that stack is not in the e2e mint matrix
 *   - `info()` null fallthrough — parent only mounts the card after
 *     the resolver succeeds, so this is dead from production parents
 * See `mint-general-config.md` for the full state machine.
 */

import {test, expect, type Locator, type Page} from '@playwright/test';

import {getConfig} from '@e2e/helpers/config';
import {mint} from '@e2e/helpers/backend';
import type {MintNutLimitBlock, MintNutLimitMethod, MintNutsBlock} from '@e2e/types/mint';

async function openConfigCard(page: Page): Promise<Locator> {
	// Only one mount: the /mint subsection dashboard. Scope by selector
	// rather than `.first()` so a regression that mounts a stray copy on
	// another page would surface as a strict-mode failure.
	const card = page.locator('orc-mint-general-config');
	await expect(card).toBeVisible();
	// The chip block + pill row settle together once `info()` resolves;
	// the parent's `mintInfoResolver` blocks the route, so the card never
	// renders empty. Use the "Supported Nuts" caption as the settled
	// signal — present in every reachable state including the empty one.
	await expect(card.getByText('Supported Nuts', {exact: true})).toBeVisible();
	return card;
}

/** Mirror of the component's `getNutStatus` (mint-general-config.component.ts:81)
 *  — returns the same `GraphicStatusState` string the chip dot's class is
 *  driven from, given a NUT number and the raw value the daemon emitted
 *  under `info.nuts[`nut${N}`]`. Tests read this side-by-side with the
 *  daemon truth and assert the chip's `.indicator-circle` carries the
 *  matching class. */
function expectedNutStatus(num: number, nut: unknown): 'inactive' | 'active' | 'disabled' | 'enabled' {
	if (nut == null || typeof nut !== 'object') return num === 4 || num === 5 ? 'inactive' : 'disabled';
	const obj = nut as Record<string, unknown>;
	const is_disabled = 'disabled' in obj && obj.disabled === true;
	const is_supported = 'supported' in obj && Boolean(obj.supported);
	if (num === 4 || num === 5) return is_disabled ? 'inactive' : 'active';
	if ('disabled' in obj) return is_disabled ? 'disabled' : 'enabled';
	if ('supported' in obj) return is_supported ? 'enabled' : 'disabled';
	return 'enabled';
}

const STATUS_BG_CLASS: Record<ReturnType<typeof expectedNutStatus>, string> = {
	active: 'orc-status-active-bg',
	inactive: 'orc-status-inactive-bg',
	enabled: 'orc-primary-bg',
	disabled: 'orc-outline-variant-bg',
};

/** NUT numbers Orchard's GraphQL schema (`OrchardNuts`) exposes to the
 *  client. The daemon's `/v1/info` emits the cashu-spec numeric keys
 *  (`"4"`, `"5"`, …) and may include NUTs not in this list (e.g. cdk
 *  publishes NUT-29); Orchard's resolver maps the schema-known keys to
 *  `nutN` properties and drops the rest. The card therefore only renders
 *  chips for the intersection — assertions filter the daemon truth to
 *  this same set so a future daemon-side NUT addition doesn't fail the
 *  spec until Orchard's schema catches up. */
const ORCHARD_NUTS = [4, 5, 7, 8, 9, 10, 11, 12, 14, 15, 17, 19, 20] as const;

/** Sorted `[number, value]` pairs for every Orchard-exposed NUT the
 *  daemon publishes. Accepts either raw cashu keys (`"4"`) or
 *  Orchard-schema keys (`"nut4"`) — `mint.getInfo()` returns the
 *  daemon's raw shape, but the helper is forgiving so a future change
 *  to swap the helper to a GraphQL-backed source doesn't ripple here. */
function nutEntries(nuts: MintNutsBlock | undefined): Array<{number: number; value: unknown}> {
	if (!nuts) return [];
	const by_number = new Map<number, unknown>();
	for (const [key, value] of Object.entries(nuts)) {
		const m = key.match(/^(?:nut)?(\d+)$/);
		if (!m) continue;
		by_number.set(parseInt(m[1], 10), value);
	}
	return ORCHARD_NUTS.filter((n) => by_number.has(n)).map((n) => ({number: n, value: by_number.get(n)}));
}

/** Strip non-digits to recover the integer the daemon stored. The
 *  `localAmount` pipe wraps amounts in glyph/locale formatting (e.g.
 *  "₿ 500,000", "500,000 sat", "500.000 sat" on es-ES); stripping
 *  non-digits is locale- and currency-display-independent. */
function amountFromText(text: string | null | undefined): number {
	const stripped = (text ?? '').replace(/\D/g, '');
	return stripped === '' ? 0 : parseInt(stripped, 10);
}

/** Read the limit row's min and max cell text, returning the underlying
 *  integer (or the literal `'∞'` for an unbounded max). The component
 *  falls back to literal `1` for null `min_amount` and `'∞'` for null
 *  `max_amount`; the assertions below feed `expected*Display(method)`
 *  to compare apples-to-apples. */
async function readLimitRow(row: Locator): Promise<{min: number; max: number | '∞'}> {
	const min_text = (await row.locator('.limit-range-min').textContent()) ?? '';
	const max_text = (await row.locator('.limit-range-max').textContent()) ?? '';
	return {
		min: amountFromText(min_text),
		max: max_text.trim() === '∞' ? '∞' : amountFromText(max_text),
	};
}

/** Pull a specific NUT block by number from the daemon's `/v1/info`,
 *  accepting both cashu-spec numeric keys and Orchard-schema `nutN`
 *  keys. Used for NUT-04 / NUT-05 fetches where the test needs the full
 *  `MintNutLimitBlock` (disabled flag + methods) rather than a raw
 *  `unknown`. Returns undefined if the daemon doesn't publish the NUT. */
function nutBlock(nuts: MintNutsBlock | undefined, num: number): MintNutLimitBlock | undefined {
	if (!nuts) return undefined;
	const direct = nuts[String(num)] ?? nuts[`nut${num}`];
	if (!direct || typeof direct !== 'object') return undefined;
	const obj = direct as Record<string, unknown>;
	if (typeof obj.disabled !== 'boolean' || !Array.isArray(obj.methods)) return undefined;
	return obj as unknown as MintNutLimitBlock;
}

function expectedMinDisplay(method: MintNutLimitMethod): number {
	return method.min_amount ?? 1;
}
function expectedMaxDisplay(method: MintNutLimitMethod): number | '∞' {
	return method.max_amount ?? '∞';
}

/** Map `bolt11` → `BOLT 11`, `bolt12` → `BOLT 12`, anything else →
 *  the raw method string. Mirrors `mint-general-payment-method`'s
 *  template `@switch` so the assertion is unambiguous. */
function expectedMethodLabel(method: string): string {
	if (method === 'bolt11') return 'BOLT 11';
	if (method === 'bolt12') return 'BOLT 12';
	return method;
}

/** Map a unit string to the `orc-graphic-asset` class the disc carries.
 *  Mirrors `unit_class` in graphic-asset.component.ts. */
function expectedAssetClass(unit: string): string {
	const u = unit.toLowerCase();
	if (u === 'sat' || u === 'msat' || u === 'btc') return 'graphic-asset-btc';
	if (u === 'usd') return 'graphic-asset-usd';
	if (u === 'eur') return 'graphic-asset-eur';
	return 'graphic-asset-unknown';
}

test.describe('mint-general-config card', {tag: '@mint'}, () => {
	test.beforeEach(async ({page}) => {
		// `/mint` is the only route that mounts this card (the index dashboard
		// hosts a different mint summary surface that does not render config).
		await page.goto('/mint');
	});

	test('renders the config card with a "Config" title', async ({page}) => {
		const card = await openConfigCard(page);
		await expect(card.getByText('Config', {exact: true})).toBeVisible();
		await expect(card.locator('mat-card')).toHaveCount(1);
	});

	test('renders one chip per `nut*` key advertised by the daemon', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const entries = nutEntries(info.nuts);
		test.skip(entries.length === 0, 'daemon publishes no `nut*` keys — chip block dead from this fixture');

		const card = await openConfigCard(page);
		await expect(card.locator('.nut-card')).toHaveCount(entries.length);
	});

	test('chip numbers match the daemon `nut*` keys in numeric order', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const entries = nutEntries(info.nuts);
		test.skip(entries.length === 0, 'daemon publishes no `nut*` keys');

		const card = await openConfigCard(page);
		const numbers = await card.locator('.nut-card .font-weight-semi-bold').allTextContents();
		expect(numbers.map((n) => parseInt(n.trim(), 10))).toEqual(entries.map((e) => e.number));
	});

	test('chip dot palette matches the daemon nut value (active/enabled/disabled)', async ({page}, testInfo) => {
		// Differential. NUT-04 + NUT-05 are `active` (green) when not
		// `disabled`; every other supported NUT is `enabled` (primary
		// dot); a key the daemon emits as `null` (e.g. nutshell's nut19)
		// becomes `disabled` (grey). The mapping is locale-independent
		// and fixture-stable.
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const entries = nutEntries(info.nuts);
		test.skip(entries.length === 0, 'daemon publishes no `nut*` keys');

		const card = await openConfigCard(page);
		const chips = card.locator('.nut-card');
		for (let i = 0; i < entries.length; i++) {
			const expected = expectedNutStatus(entries[i].number, entries[i].value);
			const class_re = new RegExp(STATUS_BG_CLASS[expected]);
			await expect(chips.nth(i).locator('.indicator-circle')).toHaveClass(class_re);
		}
	});

	test('renders the "Supported Nuts" caption beneath the chip row', async ({page}) => {
		const card = await openConfigCard(page);
		await expect(card.getByText('Supported Nuts', {exact: true})).toBeVisible();
	});

	test('minting status pill reflects nut4.disabled', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const nut4 = nutBlock(info.nuts, 4);
		test.skip(!nut4, 'daemon does not publish nut4 — pill block contract not assertable');

		const card = await openConfigCard(page);
		const expected_text = nut4!.disabled ? 'Minting disabled' : 'Minting enabled';
		await expect(card.getByText(expected_text, {exact: true})).toBeVisible();
	});

	test('melting status pill reflects nut5.disabled', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const nut5 = nutBlock(info.nuts, 5);
		test.skip(!nut5, 'daemon does not publish nut5');

		const card = await openConfigCard(page);
		const expected_text = nut5!.disabled ? 'Melting disabled' : 'Melting enabled';
		await expect(card.getByText(expected_text, {exact: true})).toBeVisible();
	});

	test('renders one minting-limit row per `nut4.methods[]` entry', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const nut4 = nutBlock(info.nuts, 4);
		test.skip(!nut4 || nut4.methods.length === 0, 'daemon publishes no nut4 methods — limits column collapses');

		const card = await openConfigCard(page);
		await expect(card.getByText('Minting Limits', {exact: true})).toBeVisible();
		// The two columns share the `.orc-high-card.p-0-5.p-h-1` row class
		// inside `.flex-1`. Scope by the "Minting Limits" caption's parent.
		const minting_col = card.getByText('Minting Limits', {exact: true}).locator('..');
		await expect(minting_col.locator('.limit-range')).toHaveCount(nut4!.methods.length);
	});

	test('renders one melting-limit row per `nut5.methods[]` entry', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const nut5 = nutBlock(info.nuts, 5);
		test.skip(!nut5 || nut5.methods.length === 0, 'daemon publishes no nut5 methods — limits column collapses');

		const card = await openConfigCard(page);
		await expect(card.getByText('Melting Limits', {exact: true})).toBeVisible();
		const melting_col = card.getByText('Melting Limits', {exact: true}).locator('..');
		await expect(melting_col.locator('.limit-range')).toHaveCount(nut5!.methods.length);
	});

	test('minting-limit row badge matches the daemon method (BOLT 11 etc.)', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const nut4 = nutBlock(info.nuts, 4);
		test.skip(!nut4 || nut4.methods.length === 0, 'daemon publishes no nut4 methods');

		const card = await openConfigCard(page);
		const minting_col = card.getByText('Minting Limits', {exact: true}).locator('..');
		const badges = minting_col.locator('orc-mint-general-payment-method');
		for (let i = 0; i < nut4!.methods.length; i++) {
			await expect(badges.nth(i)).toContainText(expectedMethodLabel(nut4!.methods[i].method));
		}
	});

	test('melting-limit row badge matches the daemon method (BOLT 11 etc.)', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const nut5 = nutBlock(info.nuts, 5);
		test.skip(!nut5 || nut5.methods.length === 0, 'daemon publishes no nut5 methods');

		const card = await openConfigCard(page);
		const melting_col = card.getByText('Melting Limits', {exact: true}).locator('..');
		const badges = melting_col.locator('orc-mint-general-payment-method');
		for (let i = 0; i < nut5!.methods.length; i++) {
			await expect(badges.nth(i)).toContainText(expectedMethodLabel(nut5!.methods[i].method));
		}
	});

	test('limit row asset disc class matches the daemon method unit', async ({page}, testInfo) => {
		// Bitcoin units (sat/msat/btc) all map to `graphic-asset-btc`. Live
		// fixtures only emit `sat`, but the assertion is shape-correct for
		// any future unit additions on the same daemon.
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const nut4 = nutBlock(info.nuts, 4);
		const nut5 = nutBlock(info.nuts, 5);
		test.skip(!nut4 || nut4.methods.length === 0, 'daemon publishes no nut4 methods');

		const card = await openConfigCard(page);
		const minting_col = card.getByText('Minting Limits', {exact: true}).locator('..');
		const minting_assets = minting_col.locator('orc-graphic-asset');
		for (let i = 0; i < nut4!.methods.length; i++) {
			const expected_class = expectedAssetClass(nut4!.methods[i].unit);
			await expect(minting_assets.nth(i).locator('.graphic-asset-unit')).toHaveClass(new RegExp(expected_class));
		}

		if (nut5 && nut5.methods.length > 0) {
			const melting_col = card.getByText('Melting Limits', {exact: true}).locator('..');
			const melting_assets = melting_col.locator('orc-graphic-asset');
			for (let i = 0; i < nut5.methods.length; i++) {
				const expected_class = expectedAssetClass(nut5.methods[i].unit);
				await expect(melting_assets.nth(i).locator('.graphic-asset-unit')).toHaveClass(new RegExp(expected_class));
			}
		}
	});

	test('minting-limit row min/max amounts match the daemon (∞ for null max, 1 for null min)', async ({page}, testInfo) => {
		// nutshell publishes both bounds as null ⇒ rendered as "1" / "∞".
		// cdk publishes 1 / 500_000 ⇒ rendered as the formatted number.
		// `amountFromText` strips formatting so the assertion is locale- and
		// glyph/code-currency-display-independent.
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const nut4 = nutBlock(info.nuts, 4);
		test.skip(!nut4 || nut4.methods.length === 0, 'daemon publishes no nut4 methods');

		const card = await openConfigCard(page);
		const minting_col = card.getByText('Minting Limits', {exact: true}).locator('..');
		const rows = minting_col.locator('.limit-range');
		for (let i = 0; i < nut4!.methods.length; i++) {
			const {min, max} = await readLimitRow(rows.nth(i));
			expect(min).toBe(expectedMinDisplay(nut4!.methods[i]));
			expect(max).toBe(expectedMaxDisplay(nut4!.methods[i]));
		}
	});

	test('melting-limit row min/max amounts match the daemon (∞ for null max, 1 for null min)', async ({page}, testInfo) => {
		const config = getConfig(testInfo.project.name);
		const info = mint.getInfo(config);
		const nut5 = nutBlock(info.nuts, 5);
		test.skip(!nut5 || nut5.methods.length === 0, 'daemon publishes no nut5 methods');

		const card = await openConfigCard(page);
		const melting_col = card.getByText('Melting Limits', {exact: true}).locator('..');
		const rows = melting_col.locator('.limit-range');
		for (let i = 0; i < nut5!.methods.length; i++) {
			const {min, max} = await readLimitRow(rows.nth(i));
			expect(min).toBe(expectedMinDisplay(nut5!.methods[i]));
			expect(max).toBe(expectedMaxDisplay(nut5!.methods[i]));
		}
	});
});
