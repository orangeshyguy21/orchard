/**
 * Per-stack oracle backfill setup. Drives the actual Backfill Prices flow on
 * `/bitcoin/oracle` so downstream `@oracle` specs find a populated price feed.
 *
 * Tagged `@oracle` so it only runs on stacks where the bitcoin oracle was
 * enabled by `settings.setup.ts` (today: cln-nutshell-postgres). On other
 * stacks the project's grep yields zero tests and the dependency completes
 * instantly.
 *
 * Two-layer skip: this setup skips with `e2e-readiness:` if mainchain isn't
 * synced enough to compute a price; downstream `@oracle` specs skip with the
 * same prefix if no oracle data is present. So a stuck IBD doesn't fail the
 * run — it just collapses everything @oracle into structured skips.
 *
 * The submit trigger is non-obvious: the form has no submit button. Filling
 * `date_start` registers a PENDING event in `EventService`, which morphs the
 * global `orc-event-general-nav-tool` to a save icon. Clicking that nav tool
 * is what fires `submitBackfill()` — same pattern `settings.setup.ts` uses
 * for app-settings commits.
 */

import {test as setup, expect, type Page} from '@playwright/test';
import {DateTime} from 'luxon';
import {mainchainSynced, requireReady, oracleHasRecentData, getReadiness} from '../helpers/readiness';

const BACKFILL_TIMEOUT_MS = 5 * 60_000;

/** Type yesterday-UTC into the date_start input. Bypasses the calendar
 *  overlay (slow/flaky under matrix locales) and the form's date adapter
 *  parses the typed string back into a Luxon DateTime via Material's
 *  format 'D' (locale-dependent DATE_SHORT). The oracle module provides
 *  `MAT_LUXON_DATE_ADAPTER_OPTIONS: { useUtc: true }`, so the parsed value
 *  is UTC-zoned — `submitBackfill` then commits exactly yesterday-UTC.
 *
 *  Locale is read from the same localStorage key the app's `LOCALE_ID`
 *  factory uses, so the string we produce matches the format the picker
 *  expects. */
async function pickYesterday(page: Page): Promise<void> {
	const locale = await page.evaluate(() => {
		try {
			const item = localStorage.getItem('v0.setting.locale');
			if (item) {
				const parsed = JSON.parse(item) as {code?: string};
				if (parsed?.code) return parsed.code;
			}
		} catch {}
		return Intl.DateTimeFormat().resolvedOptions().locale;
	});

	const date_str = DateTime.utc().minus({days: 1}).startOf('day').setLocale(locale).toLocaleString(DateTime.DATE_SHORT);

	const input = page.locator('orc-bitcoin-subsection-oracle-form input[formControlName="date_start"]');
	await input.fill(date_str);
	await input.blur();
}

setup('compute yesterday oracle', {tag: '@oracle'}, async ({page}) => {
	setup.setTimeout(BACKFILL_TIMEOUT_MS + 30_000);

	await page.goto('/bitcoin/oracle', {waitUntil: 'networkidle'});
	await requireReady(page, mainchainSynced);

	const yesterday_unix = DateTime.utc().minus({days: 1}).startOf('day').toUnixInteger();
	const already_done = await getReadiness(page).then((r) => r.oracle_recent.some((p) => p.date >= yesterday_unix));
	if (already_done) return;

	const oracle = page.locator('orc-bitcoin-subsection-oracle');
	await oracle.locator('button', {has: page.locator('mat-icon', {hasText: 'history'})}).click();

	await pickYesterday(page);

	const save = page.locator('.event-nav-tool.nav-tool-highlight').first();
	await expect(save).toBeVisible();
	await save.click();

	await expect
		.poll(
			async () => {
				const r = await getReadiness(page);
				return r.oracle_recent.some((p) => p.date >= yesterday_unix);
			},
			{timeout: BACKFILL_TIMEOUT_MS, intervals: [2_000]},
		)
		.toBe(true);
});
